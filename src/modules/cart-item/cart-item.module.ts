import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CartItem } from "./cart-item.entity";
import { CartItemController } from "./cart-item.controller";
import { CartItemService } from "./cart-item.service";
import { ProductModule } from "../products/product.module";
import { OrderModule } from "../order/order.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([CartItem]),
        ProductModule,
    ],
    controllers: [CartItemController],
    providers: [CartItemService],
})
export class CartItemModule{

}