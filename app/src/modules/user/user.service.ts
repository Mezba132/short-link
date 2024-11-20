import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { ErrorMsg } from 'src/utility/custom-msg';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  getAllUsers = async (): Promise<User[]> => {
    try {
      const users = await this.userModel
        .find()
        .select('_id name email role')
        .exec();

      return users;
    } catch (error) {
      throw new NotFoundException(ErrorMsg.USER_NOT_FOUND);
    }
  };

  getSingleUser = async (id: string): Promise<User> => {
    try {
      const user = await this.userModel
        .findById(id)
        .select('_id name email role')
        .exec();

      return user;
    } catch (error) {
      throw new NotFoundException(ErrorMsg.USER_NOT_FOUND);
    }
  };
}
