import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({ example: '12345', description: 'Id пользователя' })
  @IsNumber()
  readonly user_id: number;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiaXZhbi5pdmFub3YiLCJpYXQiOjE3MTcwNTY1NDIsImV4cCI6MTcxNzA1Njg0Mn0.mh_sbjWGag1WrEa5vNHvfz-MSqnSrBhBraVn30KaOD0',
    description: 'Refresh-токен',
  })
  @IsString()
  readonly refresh_token: string;
}
