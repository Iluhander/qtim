import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, DefaultValuePipe, ParseIntPipe, Req } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto, UpdateArticleDto } from './dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Статьи')
@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private jwtService: JwtService
  ) {}

  @ApiOperation({
    summary: 'Создать статью',
  })
  @ApiResponse({ status: 200, description: 'Статья успешно создана' })
  @ApiResponse({ status: 400, description: 'Указаны некорректные данные статьи' })
  @ApiResponse({ status: 401, description: 'Требуется аутентификация' })
  @ApiResponse({ status: 500, description: 'Внутрення ошибка' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createArticleDto: CreateArticleDto, @Req() req) {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader.split(' ')[1];

    const { sub } = this.jwtService.decode(accessToken);

    return this.articlesService.create(sub, createArticleDto);
  }

  @ApiOperation({
    summary: 'Получить все статьи',
  })
  @ApiResponse({ status: 200, description: 'Получены статьи' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка' })
  @ApiQuery({ name: 'page_index', required: false, type: 'number', description: 'Номер страницы (отсчитывается с нуля)' })
  @ApiQuery({ name: 'publication_date', required: false, type: 'string' })
  @ApiQuery({ name: 'author_id', required: false, type: 'number' })
  @ApiBearerAuth('JWT-auth')
  @Get()
  findAll(
    @Query('page_index', new DefaultValuePipe(0), ParseIntPipe) pageIndex?: number,
    @Query('publication_date') publicationDate?: string,
    @Query('author_id') authorId?: number
  ) {
    return this.articlesService.find(pageIndex, publicationDate, authorId);
  }

  @ApiOperation({
    summary: 'Получить статью',
  })
  @ApiResponse({ status: 200, description: 'Пост успешно создан' })
  @ApiResponse({ status: 400, description: 'Сессия не найдена' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка' })
  @ApiParam({ name: 'id', type: 'number', description: 'Идентификатор статьи' })
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.articlesService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Обновить статью',
  })
  @ApiResponse({ status: 200, description: 'Статья успешно обновлена' })
  @ApiResponse({ status: 400, description: 'Указаны некорректные данные' })
  @ApiResponse({ status: 401, description: 'Требуется аутентификация' })
  @ApiResponse({ status: 404, description: 'Статья не найдена' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка' })
  @ApiParam({ name: 'id', type: 'number', description: 'Идентификатор статьи' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @ApiOperation({
    summary: 'Удалить статью',
  })
  @ApiResponse({ status: 200, description: 'Статья успешно удалена' })
  @ApiResponse({ status: 401, description: 'Требуется аутентификация' })
  @ApiResponse({ status: 404, description: 'Статья не найдена' })
  @ApiResponse({ status: 500, description: 'Внутренняя ошибка' })
  @ApiParam({ name: 'id', type: 'number', description: 'Идентификатор статьи' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.articlesService.remove(+id);
  }
}