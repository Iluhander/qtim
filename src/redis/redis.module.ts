// services/redis.module.ts
import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}