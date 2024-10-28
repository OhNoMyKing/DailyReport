import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "../order/order.entity";
import { Product } from "../products/product.entity";
import { Payment } from "../payment/payment.entity";

@Entity({name : 'order_item'})
export class OrderItem{
    @PrimaryGeneratedColumn({name: 'id'})
    id : number;
    @ManyToOne(()=> Product, (product) => product.orderItem)
    @JoinColumn({name : 'product_id'})
    product : Product;
    @Column({name : 'quantity'})
    quantity: number;
    @Column({name : 'subtotal'})
    subtotal : number;
    @Column({name : 'price'})
    price: number;
    @ManyToOne(()=> Order, (order) =>order.orderItem)
    @JoinColumn({name: 'order_id'})
    order : Order;
}