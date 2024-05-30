// services/redis.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor(
    private configService: ConfigService,
  ) {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
      family: 4,
    });

    this.client.connect().catch(err => console.error('Redis connection error', err));
  }

  onClose() {
    this.client.quit();
  }
}