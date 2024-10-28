import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./order.entity";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { CartModule } from "../cart/cart.module";
import { CartItemModule } from "../cart-item/cart-item.module";
import { ProductModule } from "../products/product.module";
import { OrderItemService } from "../order-item/order.item.service";
import { OrderItem } from "../order-item/order-item.entity";
import { OrderItemModule } from "../order-item/order-item.module";

@Module({
    imports:[
        TypeOrmModule.forFeature([Order]),
        OrderItemModule,
        CartModule,
        CartItemModule,
        ProductModule,
    ],
    providers: [OrderService],
    controllers: [OrderController],
    exports: [OrderService]
})
export class OrderModule{

}