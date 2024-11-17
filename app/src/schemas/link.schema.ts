import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Link extends Document {
  @Prop({ required: true })
  originalUrl: string;

  @Prop({ unique: true, required: true })
  alias: string;

  @Prop({ unique: true, sparse: true })
  customAlias?: string;

  @Prop({ default: false })
  isPrivate: boolean;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: 0 })
  visitCount: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const LinkSchema = SchemaFactory.createForClass(Link);
