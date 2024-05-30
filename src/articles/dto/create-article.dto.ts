import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsNotEmpty, MinLength } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ example: 'Моя статья', description: 'Название' })
  @MinLength(4)
  @IsString()
  readonly title: string;

  @ApiProperty({ example: 'Описание моей статьи', description: 'Описание' })
  @MinLength(10)
  @IsString()
  readonly description: string;
}