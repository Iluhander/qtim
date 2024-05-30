import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsOptional, Matches, IsIn } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'ivan.ivanov', description: 'Username' })
  @IsString({ message: 'Поле username должно быть строкой' })
  @Length(4, 50, { message: 'Не меньше 4 и не больше 50' })
  readonly username: string;

  @ApiProperty({ example: 'Qwerty', description: 'пароль' })
  @IsString({ message: 'Необходимо поле пароль' })
  @Length(4, 30, { message: 'Не меньше 4 и не больше 30' })
  readonly password: string;

  @ApiProperty({ example: 'USER', description: 'Роль пользователя в системе' })
  @IsString({ message: 'Необходимо поле роль в системе' })
  @IsIn(['USER', 'ADMIN'], { message: 'Недопустимая роль' })
  readonly role: string;
}
