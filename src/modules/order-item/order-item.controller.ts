import { Controller } from "@nestjs/common";
import { OrderService } from "../order/order.service";
import { OrderItemService } from "./order.item.service";

@Controller('order-item')
export class OrderItemController{
    constructor(
        private orderItemService : OrderItemService
    ){}
}
