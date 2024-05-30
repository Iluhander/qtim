import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsNotEmpty } from 'class-validator';

export class AuthDto {
  @ApiProperty({ example: 'ivan.ivanov', description: 'Username' })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty()
  readonly username: string;

  @ApiProperty({ example: 'Qwerty', description: 'пароль' })
  @IsString({ message: 'Должно быть строкой' })
  @IsNotEmpty()
  readonly password: string;
}
