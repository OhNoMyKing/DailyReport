import { Injectable } from "@nestjs/common";
import { Order } from "./order.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CartItem } from "../cart-item/cart-item.entity";
import { EntityManager, Repository } from "typeorm";
import { CreateOrderDto } from "./dto/createOrderDto";
import { CartService } from "../cart/cart.service";
import { OrderItemService } from "../order-item/order.item.service";
import { UpdateOrderStatusDto } from "./dto/updateOrderdto";

@Injectable()
export class OrderService{
    constructor(
        @InjectRepository(Order)
        private orderRepository : Repository<Order>,
        private entityManager : EntityManager,
        private cartService : CartService,
        private orderItemService : OrderItemService
    ){}
    async createOrder(createOrderDto : CreateOrderDto) : Promise<Order>{
        const cart = await this.cartService.getCartById(createOrderDto.cartId);
        const userId = cart.user.id;
        const totalPrice = cart.totalPrice;
        const orderDate = new Date();
        const value = [userId,totalPrice,orderDate,createOrderDto.paymentMethod,createOrderDto.shippingInfo,createOrderDto.status]
        const query =`
            INSERT INTO "order"(user_id,total_price,order_date,payment_method, shipping_info,status)
            VALUES ($1,$2,$3,$4,$5,$6)
            RETURNING *
        `
        const orderResult = await this.entityManager.query(query,value);
        console.log(orderResult);
        const order_id = orderResult[0].id;
        await this.orderRepository.save(orderResult);
        const orderItem = await this.orderItemService.createOrderItem2(cart,order_id);
        console.log(orderItem);
        return orderResult[0];
    }
    async updateOrderStatus(orderId : number, updateOrderStatusDto : UpdateOrderStatusDto){
        const order = await this.orderRepository.findOne({
            where:{id:orderId}
        });
        if(!order){
            throw new Error('Order not found');
        }
        order.status = updateOrderStatusDto.status;
        return await this.orderRepository.save(order);
    }
    async getOrdersByUserId(userId : number) : Promise<Order[]>{
        return await this.orderRepository.find({
            where: {
                user : {id : userId}
            },
            relations :['orderItems', 'payment'],
        });
    }

    async getOrderById(id : number) : Promise<Order>{
        return await this.orderRepository.findOne({
            where : {id}
        })
    }
}