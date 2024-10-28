import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "../order/order.entity";
import { User } from "../users/user.entity";
import { PaymentMethod} from "../payment-method/payment-method.entity";
@Entity({name : 'payment'})
export class Payment{
    @PrimaryGeneratedColumn({name : 'id'})
    id: number;
    @ManyToOne(() => Order, (order) => order.payment)
    @JoinColumn({name : 'order_id'})
    order: Order;
    @ManyToOne(()=>User, (user)=> user.payment)
    @JoinColumn({name : 'user_id'})
    user : User;
    @Column({name : 'amount'})
    amount : number;
    @ManyToOne(()=> PaymentMethod, (paymentMethod)=> paymentMethod.payment)
    @JoinColumn({name : 'payment_method_id'})
    paymentMethod : PaymentMethod;
    @Column({name : 'status_payment'})
    statusPayment: string;
    @Column({type : 'timestamp', name :'date_payment'})
    createAt: Date;
}