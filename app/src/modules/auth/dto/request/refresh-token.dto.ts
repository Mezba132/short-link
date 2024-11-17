import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'The refresh token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImpvaG5kb2VAZXhhbXBsZS5jb20iLCJfaWQiOiI2NzM5OWU5Yzc1MTc2OTNjMTcxNjk3ZTYiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE3MzE4Mjk2NDQsImV4cCI6MTczMjQzNDQ0NH0.zX0L0noYQFYh873QaeddoLgo5lO-reiYYrgvP28WkRQ',
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
