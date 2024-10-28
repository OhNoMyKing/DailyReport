import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderItem } from "./order-item.entity";
import { OrderModule } from "../order/order.module";
import { OrderItemService } from "./order.item.service";
import { OrderController } from "../order/order.controller";
import { OrderService } from "../order/order.service";
import { OrderItemController } from "./order-item.controller";

@Module({
    imports:[
        TypeOrmModule.forFeature([OrderItem]),
    ],
    providers:[OrderItemService],
    controllers:[OrderItemController],
    exports:[OrderItemService]
})
export class OrderItemModule{

}