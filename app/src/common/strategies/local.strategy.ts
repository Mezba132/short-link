import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { UserInfo } from 'src/modules/auth/dto/response/sign-up.dto';

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
    data?: UserInfo;
  }> {
    let user = await this.authService.validateUser(email, password);
    return {
      success: true,
      data: user,
    };
  }
}
