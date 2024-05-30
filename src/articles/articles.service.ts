import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { CreateArticleDto, UpdateArticleDto } from './dto';
import { DefaultPageSize } from '../common/consts';
 
@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    // private redisService: RedisService
  ) {}

  create(authorId: number, createArticleDto: CreateArticleDto): Promise<Article> {
    const article = new Article();

    article.title = createArticleDto.title;
    article.description = createArticleDto.description;
    article.userId = authorId;
    article.publicationDate = new Date().toISOString();

    const created = this.articlesRepository.create(article);
    return this.articlesRepository.save(created);
  }

  find(pageIndex: number, publicationDate?: string, authorId?: number): Promise<Article[]> {
    const searchObj: Record<string, any> = {
      where: {}
    };

    if (publicationDate) {
      searchObj.where.publicationDate = publicationDate;
    }

    if (authorId) {
      searchObj.where.authorId = authorId;
    }

    return this.articlesRepository.find({
      take: DefaultPageSize,
      skip: pageIndex
    });
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.articlesRepository.findOne({ where: { id } });

    if (!article) {
      throw new NotFoundException();
    }

    return article;
  }

  async update(id: number, updateArticleDto: UpdateArticleDto): Promise<Article> {
    const article = await this.articlesRepository.findOne({ where: { id } });

    if (!article) {
      throw new NotFoundException();
    }

    await this.articlesRepository.update({ id }, updateArticleDto)
    
    return {
      ...article,
      ...updateArticleDto
    };
  }

  async remove(id: number): Promise<void> {
    const article = await this.articlesRepository.findOne({ where: { id } });

    if (!article) {
      throw new NotFoundException();
    }

    await this.articlesRepository.delete(id);
  }
}
