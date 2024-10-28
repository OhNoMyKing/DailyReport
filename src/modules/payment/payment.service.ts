import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Payment } from "./payment.entity";
import { Repository } from "typeorm";
import { PaymentGateWay } from "./payment.gateway";
import { OrderService } from "../order/order.service";
import { CreatePaymentDto } from "./dto/create.payment.dto";
import { UserService } from "../users/user.service";
import { PaymentMethod } from "../payment-method/payment-method.entity";
import { PaymentMethodService } from "../payment-method/payment-method.service";
import { UpdateOrderStatusDto } from "../order/dto/updateOrderdto";
import { OrderStatusEnum } from "src/common/enum/order-status.enum";

@Injectable()
export class PaymentService{
    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository : Repository<Payment>,
        private readonly userService : UserService,
        private readonly orderService : OrderService,
        private readonly paymentGateWay : PaymentGateWay,
        private readonly paymentMethodService : PaymentMethodService
    ) {}

    async processPayment(paymentDto : CreatePaymentDto){
        const order = await this.orderService.getOrderById(paymentDto.orderId);
        const user = await this.userService.findById(paymentDto.userId);
        const paymentMethod = await this.paymentMethodService.findPaymentMethodById(paymentDto.paymentMethodId);
        if(!order || !user){
            throw new Error("Order not found");
        }
        const paymentResult = await this.paymentGateWay.processPayment(paymentDto.amount,paymentDto.paymentMethodId);
        if(paymentResult.success){
            const payment = new Payment();
            payment.order = order;
            payment.user = user;
            payment.amount = paymentDto.amount;
            payment.paymentMethod = paymentMethod;
            payment.statusPayment = "Done";
            payment.createAt = new Date();
            await this.paymentRepository.save(payment);
            const updateOrderStatusDto : UpdateOrderStatusDto ={
                status : OrderStatusEnum.CONFIRMED,
            };
            await this.orderService.updateOrderStatus(order.id,updateOrderStatusDto);
            return payment;
        } else{
            throw new Error("Payment failed");
        }
    }
}