import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from '../articles.service';
import { ArticlesController } from '../articles.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Article } from '../entities/article.entity';
import { Repository } from 'typeorm';
import { MockType, repositoryMockFactory } from '../../common/tests/mockRepository';
import fakeReq from '../../common/tests/auth/fakeReq';
import { JwtService } from '@nestjs/jwt';

const defaultArticleData = {
  userId: 1,
  description: 'Test article',
  publicationDate: '2023-05-30',
};

describe('ArticlesController', () => {
  let controller: ArticlesController;
  let service: ArticlesService;
  let repositoryMock: MockType<Repository<Article>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        ArticlesService,
        JwtService,
        {
          provide: getRepositoryToken(Article),
          useClass: Repository,
        },
        { provide: getRepositoryToken(Article), useFactory: repositoryMockFactory },
      ],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
    service = module.get<ArticlesService>(ArticlesService);
    repositoryMock = module.get(getRepositoryToken(Article));
  });

  describe('create', () => {
    it('should create a new article', async () => {
      const articleData = {
        title: 'Test title',
        description: 'Test description',
        publicationDate: '2023-05-30',
      };

      const createdArticle = { id: 1, ...articleData };
      repositoryMock.create.mockReturnValue(createdArticle);
      repositoryMock.save.mockReturnValue(createdArticle);

      expect(await controller.create(articleData, fakeReq())).toBe(createdArticle);
    });
  });

  describe('findAll', () => {
    it('should return an array of articles', async () => {
      const articles = [
        { id: 1, userId: 1, description: 'Article 1', publicationDate: '2023-05-30' },
        { id: 2, userId: 2, description: 'Article 2', publicationDate: '2023-05-29' },
      ];
      repositoryMock.find.mockReturnValue(articles);

      expect(await controller.findAll()).toBe(articles);
    });
  });

  describe('findOne', () => {
    it('should return a single article', async () => {
      const articleId = 1;
      const article = { id: articleId, userId: 1, description: 'Test article', publicationDate: '2023-05-30' };

      repositoryMock.findOne.mockReturnValue(article);

      expect(await controller.findOne(articleId)).toBe(article);
    });
  });

  describe('update', () => {
    it('should update an article', async () => {
      const articleId = 1;
      const updateData = { description: 'Updated article', title: 'Updated article title' };
      
      repositoryMock.findOne.mockReturnValue(defaultArticleData);
      repositoryMock.update.mockReturnValue(updateData);

      const res = await controller.update(articleId, updateData);

      expect(res.description).toBe(updateData.description);
      expect(res.title).toBe(updateData.title);
    });
  });

  describe('remove', () => {
    it('should remove an article', async () => {
      const articleId = 1;

      repositoryMock.findOne.mockReturnValue(defaultArticleData);
      repositoryMock.delete.mockReturnValue(undefined);

      expect(await controller.remove(articleId)).toBeUndefined();
    });
  });
});
