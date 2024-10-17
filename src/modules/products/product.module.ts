import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./product.entity";
import { Category } from "../category/category.entity";
import { CategoryModule } from "../category/category.module";

@Module({

    imports: [
        TypeOrmModule.forFeature([Product,Category]),
        CategoryModule,
    ],
    providers: [ProductService],
    controllers:[ProductController],
    exports: [ProductService],
})
export class ProductModule{

}