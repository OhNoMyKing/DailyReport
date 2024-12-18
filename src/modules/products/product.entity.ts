import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../category/category.entity";
import { CartItem } from "../cart-item/cart-item.entity";
import { OrderItem } from "../order-item/order-item.entity";

@Entity({name:'products'})
export class Product{
    @PrimaryGeneratedColumn({name:'id'})
    id : number;
    @Column({name:'name'})
    name: string;
    @Column({name:'description'})
    description: string;
    @Column({name: 'price'})
    price: number;
    @Column({name:'stock'})
    stock: number;
    @ManyToOne(()=> Category, (category) => category.products)
    @JoinColumn({name: 'category_id'})
    category: Category;
    //relation cart-item
    @OneToMany(()=>CartItem, (cartItem) => cartItem.product)
    cartItem : CartItem;

    @OneToMany(()=> OrderItem, (orderItem) => orderItem.product)
    orderItem : OrderItem;
    //method
    public getDetails(): string {
        return `${this.name} - ${this.description} (${this.price})`;
    }
}