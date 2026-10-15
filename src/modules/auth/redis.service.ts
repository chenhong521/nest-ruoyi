import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

/**
 * RedisService：封装 ioredis 客户端
 * 若依用 Redis 存登录会话/权限，这里提供最简单的 get/set/del
 */
@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: Redis;

  constructor(config: ConfigService) {
    this.client = new Redis({
      host: config.get('REDIS_HOST', 'localhost'),
      port: +config.get('REDIS_PORT', 6379),
    });
  }

  /** 存字符串，可带过期时间（秒） */
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  /** 读字符串 */
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  /** 删除 */
  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  /** 应用销毁时断开连接 */
  onModuleDestroy(): void {
    this.client.quit();
  }
}
