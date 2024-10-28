import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "../order-item/order-item.entity";
import { User } from "../users/user.entity";
import { Payment } from "../payment/payment.entity";
import { OrderStatusEnum } from "src/common/enum/order-status.enum";
import { PaymentMethod } from "../payment-method/payment-method.entity";


@Entity({name: 'order'})
export class Order{
    @PrimaryGeneratedColumn({name : 'id'})
    id : number;
    @ManyToOne(() => User, (user) => user.order)
    @JoinColumn({name: 'user_id'})
    user : User;
    @Column({name:'total_price'})
    totalPrice : number;
    @Column({name:'order_date'})
    orderDate: Date;
    @Column({name:'payment_method_id'})
    paymentMethodId: number;
    @Column({name : 'shipping_info'})
    shippingInfo: string;
    @Column({name:'status', type: 'enum', enum: OrderStatusEnum, default: OrderStatusEnum.PENDING})
    status : string;
    @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
    orderItem : OrderItem[];

    @OneToMany(() => Payment, (payment) => payment.order)
    payment : Payment;
}