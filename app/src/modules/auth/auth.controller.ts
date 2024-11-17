import {
  Body,
  Controller,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { isEmpty } from 'class-validator';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SignUpDto } from './dto/request/sign-up.dto';
import { SignInDto } from './dto/request/sign-in.dto';
import { RefreshTokenDto } from './dto/request/refresh-token.dto';
import { SignUpResponse } from './dto/response/sign-up.dto';
import { SignInResponse } from './dto/response/sign-in.dto';

@Controller('auth')
@ApiTags('Authentication and Authorization')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/new')
  @ApiOperation({
    summary: 'Create a new user',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully created a new user',
  })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  async registerNewUser(@Body() body: SignUpDto): Promise<SignUpResponse> {
    return await this.authService.signUp(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: 'User Login',
  })
  @ApiResponse({
    description: 'Login Successfully',
    status: 201,
  })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiBody({ type: SignInDto })
  async login(@Request() req): Promise<SignInResponse> {
    if (req.user.success === true && !isEmpty(req.user.data)) {
      return await this.authService.signIn(req.user);
    }
    throw new UnauthorizedException();
  }

  @Post('refresh')
  @ApiBody({
    type: RefreshTokenDto,
    description: 'Refresh token for generating new access and refresh tokens',
  })
  async refresh(@Body() rt: RefreshTokenDto) {
    return this.authService.refreshTokens(rt);
  }
}
