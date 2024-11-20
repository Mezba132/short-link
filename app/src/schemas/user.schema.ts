import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum Role {
  USER = 'user',
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false, default: '' })
  refreshToken: string;

  @Prop({ required: false, default: Role.USER })
  role: Role;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
