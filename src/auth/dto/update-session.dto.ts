import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class UpdateSessionDto {
  @ApiProperty({
    example: '1',
    description: 'Уникальный идентификатор сессии',
  })
  @IsNumber()
  readonly id: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiaXZhbi5pdmFub3YiLCJpYXQiOjE3MTcwNTY1NDIsImV4cCI6MTcxNzA1Njg0Mn0.mh_sbjWGag1WrEa5vNHvfz-MSqnSrBhBraVn30KaOD0',
    description: 'Refresh-токен',
  })
  @IsString()
  readonly refresh_token: string;
}
