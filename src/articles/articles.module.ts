import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { JwtModule } from '@nestjs/jwt';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([Article])
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService, /* RedisService */],
})
export class ArticlesModule {}
