import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateLinkDto {
  @ApiProperty({
    description: 'The original URL to be shortened',
    example: 'https://example.com',
  })
  @IsUrl()
  @IsString()
  originalUrl: string;

  @ApiPropertyOptional({
    description: 'A custom alias for the shortened URL',
    example: 'example123',
    minLength: 3,
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @Length(3, 20)
  customAlias?: string;

  @ApiPropertyOptional({
    description: 'The expiration date of the shortened URL (ISO 8601 format)',
    example: '2024-12-01T00:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: Date;

  @ApiPropertyOptional({
    description: 'Whether the link should be private',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;
}
