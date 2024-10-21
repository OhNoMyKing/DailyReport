import { EntitySubscriberInterface, EventSubscriber, InsertEvent, RemoveEvent, UpdateEvent } from "typeorm";
import { Product } from "./product.entity";
import { RedisService } from "src/cache/redis.service";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { OnModuleInit } from "@nestjs/common";
import { ModuleRef } from '@nestjs/core';

@Injectable()
@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface<Product>, OnModuleInit {
    private redisService: RedisService;
  
    constructor(
      @InjectDataSource() private readonly dataSource: DataSource,
      private readonly moduleRef: ModuleRef,  // Dùng ModuleRef để lấy RedisService từ DI container
    ) {}
  
    // Lấy RedisService khi module khởi tạo
    onModuleInit() {
      this.redisService = this.moduleRef.get(RedisService, { strict: false });
  
      // Đảm bảo rằng dataSource đã sẵn sàng và thêm subscriber sau khi khởi tạo module
      if (this.dataSource && this.dataSource.subscribers) {
        this.dataSource.subscribers.push(this);
      } else {
        console.error('DataSource is not initialized or has no subscribers property');
      }
    }

  listenTo() {
    return Product;
  }

  //insert
  beforeInsert(event: InsertEvent<Product>) {
    console.log('Before Insert Product: ', event.entity);
  }

  afterInsert(event: InsertEvent<Product>) {
    console.log('After Insert Product: ', event.entity);
    if (this.redisService) {
      this.redisService.clearCache('all_products');
    }
  }

  //update
  beforeUpdate(event: UpdateEvent<Product>) {
    console.log('Before Update Product', event.entity);
  }

  afterUpdate(event: UpdateEvent<Product>) {
    console.log('After Update Product', event.entity);
    if (this.redisService) {
      this.redisService.clearCache('all_products');
    }
  }

  //delete
  beforeRemove(event: RemoveEvent<Product>) {
    console.log('Before Remove Product', event.entity);
  }

  afterRemove(event: RemoveEvent<Product>) {
    console.log('After Remove Product', event.entity);
    if (this.redisService) {
      this.redisService.clearCache('all_products');
    }
  }
}
