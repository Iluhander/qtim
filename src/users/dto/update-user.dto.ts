import { OmitType, ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsIn, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['username'] as const),
) {
  @ApiProperty({ example: 'USER', description: 'Роль пользователя в системе' })
  @IsOptional()
  @IsIn(['USER', 'ADMIN'], { message: 'Недопустимая роль' })
  readonly role: string;
}
