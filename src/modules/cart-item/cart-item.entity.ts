import { PrimaryGeneratedColumn, Entity, JoinColumn, ManyToOne, Column } from "typeorm";
import { Cart } from "../cart/cart.entity";
import { Product } from "../products/product.entity";
@Entity({name : 'cart_item'})
export class CartItem{
    @PrimaryGeneratedColumn()
    id : number;
    @ManyToOne(()=> Cart,(cart) => cart.cartItems)
    @JoinColumn({name : 'cart_id'})
    cart : Cart;

    @ManyToOne(()=> Product, (product) => product.cartItem)
    @JoinColumn({name: 'product_id'})
    product : Product;

    @Column({name : 'quantity', type:'int'})
    quantity : number;

    @Column({name: 'price_at_add_time', type: 'decimal', precision:10,scale:2})
    priceAddTime : number;
    
    @Column({name: 'subtotal', type: 'decimal', precision: 10, scale: 2})
    subtotal: number;
}