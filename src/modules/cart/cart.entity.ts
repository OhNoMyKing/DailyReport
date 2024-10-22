import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn , Column, CreateDateColumn, UpdateDateColumn, OneToMany} from "typeorm";
import { User } from "../users/user.entity";
import { CartItem } from "../cart-item/cart-item.entity";

@Entity({name: 'carts'})
export class Cart{
    @PrimaryGeneratedColumn()
    id: number;
    @OneToOne(() => User, (user) => user.cart)
    @JoinColumn({name : 'user_id'})
    user: User;
    @Column({name : 'total_price'})
    totalPrice : number;
    //relation cart-item
    @OneToMany(() => CartItem, (cartItem) => cartItem.cart,{cascade : true})
    cartItems : CartItem[];
    @CreateDateColumn({name : 'created_at'})
    createAt : Date;
    @UpdateDateColumn({name : 'updated_at'})
    updateAt: Date;
}