import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private linkModel: Model<User>) {}

  getAllUsers = async (): Promise<User[]> => {
    try {
      const users: any = await this.linkModel
        .find()
        .select('_id name email')
        .exec();

      return users;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  };

  getSingleUser = async (id: string): Promise<User> => {
    try {
      const users: any = await this.linkModel
        .findById(id)
        .select('_id name email')
        .exec();

      return users;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  };
}
