import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Types } from 'mongoose';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<{
    success: boolean;
    data?: { _id: Types.ObjectId; email: string; name: string };
  }> {
    let result = await this.authService.validateUser(email, password);

    return {
      success: true,
      data: result,
    };
  }
}
