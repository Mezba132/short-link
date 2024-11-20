import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private authModel: Model<User>,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();

    if (!roles) {
      return false;
    }

    if (request?.user) {
      const { id } = request.user;

      const user = await this.authModel.findById(id).exec();

      const userRole = user?.role;

      const hasRole = roles.includes(userRole);

      if (!hasRole) {
        throw new UnauthorizedException('You are Not Authorized');
      }

      return hasRole;
    }

    return false;
  }
}
