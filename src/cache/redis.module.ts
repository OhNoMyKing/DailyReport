// src/redis/redis.module.ts

import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';


@Module({
    imports: [
        CacheModule.register({
            store: redisStore,
            host: 'localhost',
            port: 6379,
            ttl: 900,
        }),
    ],
    providers: [RedisService],
    exports: [RedisService,CacheModule], // Xuất RedisService để có thể sử dụng ở các module khác
})
export class RedisModule {}
