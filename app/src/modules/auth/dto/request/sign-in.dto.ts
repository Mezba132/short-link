import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'johndoe@example.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123!',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/, {
    message:
      'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password: string;
}
