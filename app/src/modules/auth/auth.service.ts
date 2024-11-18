import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { SignUpDto } from './dto/request/sign-up.dto';
import { SignUpResponse } from './dto/response/sign-up.dto';
import { SignInResponse } from './dto/response/sign-in.dto';
import { RefreshTokenDto } from './dto/request/refresh-token.dto';
const bcrypt = require('bcryptjs');

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private authModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  validateUser = async (
    email: string,
    password: string,
  ): Promise<{
    _id: Types.ObjectId;
    email: string;
    name: string;
  }> => {
    const verifiedUser = await this.authModel
      .findOne({ email: email })
      .select('_id name email password')
      .exec();

    if (!verifiedUser) throw new NotFoundException(`User ${email} Not Found`);

    const passwordCheck = bcrypt.compareSync(password, verifiedUser.password);

    if (!passwordCheck) throw new BadRequestException(`Password do not match`);

    return {
      _id: verifiedUser._id as Types.ObjectId,
      name: verifiedUser.name,
      email: verifiedUser.email,
    };
  };

  signUp = async (body: SignUpDto): Promise<SignUpResponse> => {
    let salt = bcrypt.genSaltSync(10);
    body.password = bcrypt.hashSync(body.password, salt);

    let verifyEmail = await this.authModel
      .findOne({ email: body.email })
      .select('name email')
      .exec();

    if (verifyEmail) {
      throw new NotAcceptableException(
        `User ${verifyEmail.email} already exist`,
      );
    }

    const newUser = new this.authModel(body);

    try {
      let { _id, name, email } = await newUser.save();
      return {
        id: _id as Types.ObjectId,
        name,
        email,
      };
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException(`Validation failed: ${error.message}`);
      }
      throw new Error(`Failed to SignUp: ${error.message}`);
    }
  };

  signIn = async (body: {
    success: boolean;
    data?: { _id: Types.ObjectId; email: string; name: string };
  }): Promise<SignInResponse> => {
    try {
      let generateToken = await this.generateTokens(body.data);
      return {
        accessToken: generateToken.accessToken,
        refreshToken: generateToken.refreshToken,
        userInfo: body.data,
      };
    } catch (error) {
      throw new UnauthorizedException();
    }
  };

  async generateTokens(user: {
    _id: Types.ObjectId;
    email: string;
    name: string;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    let { _id, name, email } = user;
    const payload = { email, _id, name };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    await this.authModel.findByIdAndUpdate(_id, { refreshToken });
    console.log('accessToken - ', accessToken);
    console.log('refreshToken - ', refreshToken);
    return { accessToken, refreshToken };
  }

  async refreshTokens(
    rt: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.authModel
      .findOne({
        refreshToken: rt.refreshToken,
      })
      .exec();

    if (!user) throw new UnauthorizedException('Refresh Token Not Valid');
    let data = {
      _id: user._id as Types.ObjectId,
      name: user.name,
      email: user.email,
    };
    console.log('refresh token calling......');
    return this.generateTokens(data);
  }

  verifyJwt = async (jwt: string) => {
    try {
      return await this.jwtService.verify(jwt);
    } catch (error) {
      throw new UnauthorizedException('JWT verification failed');
    }
  };
}
