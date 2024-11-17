import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

class User {
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  _id: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}

export class SignInResponse {
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;

  @IsNotEmpty()
  data: User;
}
