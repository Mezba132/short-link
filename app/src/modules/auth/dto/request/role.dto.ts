import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class RoleUpdate {
  @ApiProperty({
    example: '67399e9c7517693c171697e6',
  })
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  id: Types.ObjectId;

  @ApiProperty({
    example: 'super_admin',
  })
  @IsNotEmpty()
  @IsString()
  role: string;
}
