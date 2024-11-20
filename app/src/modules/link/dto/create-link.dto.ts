import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateLinkDto {
  @ApiProperty({
    description: 'The original URL to be shortened',
    example: 'https://example.com',
  })
  @IsNotEmpty()
  @IsUrl()
  @IsString()
  originalUrl: string;

  @ApiPropertyOptional({
    description: 'A custom alias for the shortened URL',
    example: 'Short link 123',
    minLength: 3,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @Length(3, 20)
  customAlias?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: Date;

  @ApiProperty({
    example: '673c9f95a8e73a7d3c9424b8',
    required: true,
  })
  @IsOptional()
  @Type(() => Types.ObjectId)
  user?: Types.ObjectId;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
