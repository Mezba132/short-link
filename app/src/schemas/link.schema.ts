import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from './user.schema';

@Schema({ timestamps: true })
export class Link extends Document {
  @Prop({ required: true })
  originalUrl: string;

  @Prop({ unique: true, required: true })
  alias: string;

  @Prop({ unique: true, sparse: true })
  customAlias?: string;

  @Prop({ default: false })
  isPrivate?: boolean;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: 0 })
  visitCount: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  })
  user?: User;

  @Prop({ default: true })
  isActive: boolean;
}

export const LinkSchema = SchemaFactory.createForClass(Link);
