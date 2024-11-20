import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { SignUpDto } from './dto/request/sign-up.dto';
import { UserInfo } from './dto/response/sign-up.dto';
import { SignInResponse } from './dto/response/sign-in.dto';
import { RefreshTokenDto } from './dto/request/refresh-token.dto';
import { RoleUpdate } from './dto/request/role.dto';
import { ErrorMsg } from 'src/utility/custom-msg';
const bcrypt = require('bcryptjs');

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private authModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  validateUser = async (email: string, password: string): Promise<UserInfo> => {
    const verifiedUser = await this.authModel
      .findOne({ email: email })
      .select('_id name email role password')
      .exec();

    if (!verifiedUser) throw new NotFoundException(ErrorMsg.USER_NOT_FOUND);

    const passwordCheck = bcrypt.compareSync(password, verifiedUser.password);

    if (!passwordCheck)
      throw new BadRequestException(ErrorMsg.PASSWORD_MATCH_FAILED);

    return {
      _id: verifiedUser._id as Types.ObjectId,
      name: verifiedUser.name,
      email: verifiedUser.email,
      role: verifiedUser.role,
    };
  };

  signUp = async (body: SignUpDto): Promise<UserInfo> => {
    let salt = bcrypt.genSaltSync(10);
    body.password = bcrypt.hashSync(body.password, salt);

    let verifyEmail = await this.authModel
      .findOne({ email: body.email })
      .select('name email')
      .exec();

    if (verifyEmail) {
      throw new NotAcceptableException(ErrorMsg.USER_ALREADY_EXIST);
    }

    const newUser = new this.authModel(body);

    try {
      let { _id, name, email, role } = await newUser.save();
      return {
        _id: _id as Types.ObjectId,
        name,
        email,
        role,
      };
    } catch (error) {
      if (error.name === ErrorMsg.VALIDATION_ERROR) {
        throw new BadRequestException(`Validation failed: ${error.message}`);
      }
      throw new Error(`Failed to SignUp: ${error.message}`);
    }
  };

  signIn = async (body: {
    success: boolean;
    data?: UserInfo;
  }): Promise<SignInResponse> => {
    try {
      let generateToken = await this.generateTokens(body.data);
      return {
        accessToken: generateToken.accessToken,
        refreshToken: generateToken.refreshToken,
        userInfo: body.data,
      };
    } catch (error) {
      throw new UnauthorizedException(ErrorMsg.UNATHORIZED_USER);
    }
  };

  async generateTokens(
    user: UserInfo,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { _id, name, email, role } = user;
    const payload = { email, _id, name, role };
    try {
      const accessToken = this.jwtService.sign(payload);
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
      const updateResult = await this.authModel.findByIdAndUpdate(_id, {
        refreshToken,
      });
      if (!updateResult) {
        throw new NotFoundException(ErrorMsg.REFRESH_UPDATE_FAILED);
      }
      return { accessToken, refreshToken };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(ErrorMsg.FAILED_GENERATE_TOKEN);
    }
  }

  async refreshTokens(rt: RefreshTokenDto): Promise<{
    accessToken: string;
    refreshToken: string;
    userInfo: UserInfo;
  }> {
    const user = await this.authModel
      .findOne({
        refreshToken: rt.refreshToken,
      })
      .exec();

    if (!user) throw new UnauthorizedException(ErrorMsg.TOKEN_INVALID);
    let data = {
      _id: user._id as Types.ObjectId,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    let { accessToken, refreshToken } = await this.generateTokens(data);
    return {
      accessToken,
      refreshToken,
      userInfo: data,
    };
  }

  verifyJwt = async (jwt: string) => {
    try {
      return await this.jwtService.verify(jwt);
    } catch (error) {
      throw new UnauthorizedException(ErrorMsg.VERIFICATION_FAILED);
    }
  };

  updateUserRole = async ({ id, role }: RoleUpdate) => {
    try {
      let result = await this.authModel.findByIdAndUpdate(
        id,
        { $set: { role } },
        { new: true },
      );
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error updating user role: ${error.message}`,
      );
    }
  };
}
