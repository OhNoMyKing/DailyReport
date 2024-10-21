import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { Category } from "../category/category.entity";
import { CategoryModule } from "../category/category.module";
import { RedisModule } from "src/cache/redis.module";
import { ProductSubscriber } from "./product.subscriber";
import { RedisService } from "src/cache/redis.service";

@Module({

    imports: [
        TypeOrmModule.forFeature([Product,Category]),
        CategoryModule,
        RedisModule,
    ],
    providers: [ProductService,ProductSubscriber],
    controllers:[ProductController],
    exports: [ProductService],
})
export class ProductModule{

}