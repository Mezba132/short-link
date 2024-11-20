import {
  Body,
  Controller,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard';
import { isEmpty } from 'class-validator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SignUpDto } from './dto/request/sign-up.dto';
import { SignInDto } from './dto/request/sign-in.dto';
import { RefreshTokenDto } from './dto/request/refresh-token.dto';
import { UserInfo } from './dto/response/sign-up.dto';
import { SignInResponse } from './dto/response/sign-in.dto';
import { RoleUpdate } from './dto/request/role.dto';
import { hasRoles } from 'src/common/decorators/roles.decorator';
import { EndPoint } from 'src/utility/end-points';
import { Tags } from 'src/utility/api-tags';
import { ErrorMsg, SuccessMsg, Summary } from 'src/utility/custom-msg';
import { StatusCode } from 'src/utility/status-codes';
import { Role } from 'src/schemas/user.schema';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller()
@ApiTags(Tags.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(EndPoint.SIGN_UP)
  @ApiOperation({ summary: Summary.SIGN_UP })
  @ApiResponse({ status: StatusCode.CREATED, description: SuccessMsg.SIGN_UP })
  @ApiBadRequestResponse({ description: ErrorMsg.INVALID_BODY })
  async registerNewUser(@Body() body: SignUpDto): Promise<UserInfo> {
    return await this.authService.signUp(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post(EndPoint.SIGN_IN)
  @ApiOperation({ summary: Summary.SIGN_IN })
  @ApiResponse({ status: StatusCode.CREATED, description: SuccessMsg.SIGN_IN })
  @ApiBadRequestResponse({ description: ErrorMsg.INVALID_BODY })
  @ApiBody({ type: SignInDto })
  async login(@Request() req): Promise<SignInResponse> {
    if (req.user.success === true && !isEmpty(req.user.data)) {
      return await this.authService.signIn(req.user);
    }
    throw new UnauthorizedException();
  }

  @ApiOperation({ summary: Summary.UPDATE_ROLE })
  @ApiResponse({
    status: StatusCode.OK,
    description: SuccessMsg.UPDATE_ROLE,
  })
  @ApiBadRequestResponse({ description: ErrorMsg.INVALID_BODY })
  @ApiBearerAuth()
  @Post(EndPoint.UPDATE_USER_ROLE)
  @hasRoles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  updateUserRole(@Body() body: RoleUpdate) {
    return this.authService.updateUserRole(body);
  }

  @Post(EndPoint.REFRESH)
  @ApiOperation({ summary: Summary.UPDATE_REFRESH })
  @ApiResponse({
    status: StatusCode.CREATED,
    description: SuccessMsg.UPDATE_REFRESH_TOKEN,
  })
  @ApiBadRequestResponse({ description: ErrorMsg.INVALID_BODY })
  async refresh(@Body() rt: RefreshTokenDto) {
    return this.authService.refreshTokens(rt);
  }
}
