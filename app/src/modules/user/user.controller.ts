import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller()
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fetch all users' })
  @ApiResponse({ status: 201, description: 'Successfully get all users' })
  @ApiBearerAuth()
  @Get('users')
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Fetch Single user' })
  @ApiResponse({ status: 201, description: 'Successfully get Single user' })
  @ApiBearerAuth()
  @Get('user/:id')
  getSingleUser(@Param('id') id: string) {
    return this.userService.getSingleUser(id);
  }
}
