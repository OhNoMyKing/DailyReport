import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Cart } from "./cart.entity";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { CartItem } from "../cart-item/cart-item.entity";
import { CartItemService } from "../cart-item/cart-item.service";
import { ProductService } from "../products/product.service";
import { ProductModule } from "../products/product.module";

@Module({
    imports:[
        TypeOrmModule.forFeature([Cart,CartItem,CartItemService]),
        ProductModule,
    ],
    controllers: [CartController],
    providers: [CartService,CartItemService],
    exports: [CartService,CartItemService],
})
export class CartModule{}