import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class SignUpResponse {
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  id: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
