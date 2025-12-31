import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis'; // Assuming ioredis is installed

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  public readonly client: Redis; // Public for direct access if needed

  constructor() {
    // In a real application, retrieve Redis URL from environment variables
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    this.client = new Redis(redisUrl);

    this.client.on('error', (err) => {
      this.logger.error('Redis Client Error:', err);
    });

    this.client.on('connect', () => {
      this.logger.log('Connected to Redis');
    });

    this.client.on('ready', () => {
      this.logger.log('Redis client is ready');
    });

    this.client.on('end', () => {
      this.logger.log('Redis client connection ended');
    });
  }

  async onModuleInit() {
    // Ping Redis to ensure connection is working
    try {
      await this.client.ping();
      this.logger.log('Redis ping successful');
    } catch (error) {
      this.logger.error('Redis ping failed:', error);
    }
  }

  async onModuleDestroy() {
    await this.client.quit(); // Disconnect gracefully
  }

  // --- Queue Operations (Basic) ---
  async enqueue(queueName: string, data: any): Promise<number> {
    const serializedData = JSON.stringify(data);
    return this.client.rpush(queueName, serializedData); // Add to the right (end) of the list
  }

  async dequeue(queueName: string, timeout: number = 0): Promise<any | null> {
    const result = await this.client.blpop(queueName, timeout); // Blocking left pop
    if (result && result[1]) {
      return JSON.parse(result[1]);
    }
    return null;
  }

  async getQueueLength(queueName: string): Promise<number> {
    return this.client.llen(queueName);
  }
}
