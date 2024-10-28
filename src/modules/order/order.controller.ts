import { Body, Controller, Param, Patch, Post, Put, Request} from "@nestjs/common";
import { CartItem } from "../cart-item/cart-item.entity";
import { CreateOrderDto } from "./dto/createOrderDto";
import { OrderService } from "./order.service";
import { Order } from "./order.entity";
import { UpdateOrderStatusDto } from "./dto/updateOrderdto";

@Controller('order')
export class OrderController{
    constructor(
        private orderService : OrderService
    ){}
    @Post('create')
    async createOrder(@Body() body : CreateOrderDto){
        const order = await this.orderService.createOrder(body);
        return order;
    }

    @Patch(':id/status')
    async updateOrderStatus(@Param('id') id : number, @Body() updateOrderStatusDto : UpdateOrderStatusDto){
        return this.orderService.updateOrderStatus(id,updateOrderStatusDto);
    }
    async getOrdersById(@Request() req) : Promise<Order[]>{
        const userId = req.user.id;
        const listOrder = this.orderService.getOrdersByUserId(userId);
        return listOrder;
    }
}