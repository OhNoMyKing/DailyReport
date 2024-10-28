import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Payment } from "../payment/payment.entity";

@Entity({name :'payment_method'})
export class PaymentMethod{
    @PrimaryGeneratedColumn()
    id : number;

    @Column({type:'varchar', length:255})
    methodName : string;

    @OneToMany(()=> Payment, (payment) => payment.paymentMethod)
    payment : Payment[]
}