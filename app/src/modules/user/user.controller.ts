import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { hasRoles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Role } from 'src/schemas/user.schema';
import { EndPoint } from 'src/utility/end-points';
import { ErrorMsg, SuccessMsg, Summary } from 'src/utility/custom-msg';
import { StatusCode } from 'src/utility/status-codes';

@Controller()
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: Summary.ALL_USERS })
  @ApiResponse({
    status: StatusCode.OK,
    description: SuccessMsg.FETCH_ALL_USERS,
  })
  @ApiResponse({
    status: StatusCode.NOT_FOUND,
    description: ErrorMsg.USER_NOT_FOUND,
  })
  @Get(EndPoint.ALL_USERS)
  @hasRoles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: Summary.SINGLE_USER })
  @ApiResponse({
    status: StatusCode.OK,
    description: SuccessMsg.FETCH_SINGLE_USER,
  })
  @ApiResponse({
    status: StatusCode.NOT_FOUND,
    description: ErrorMsg.USER_NOT_FOUND,
  })
  @Get(EndPoint.SINGLE_USER)
  @hasRoles(Role.USER, Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  getSingleUser(@Param('id') id: string) {
    return this.userService.getSingleUser(id);
  }
}
