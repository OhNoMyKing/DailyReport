import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { CartItem } from "./cart-item.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductService } from "../products/product.service";
import { Cart } from "../cart/cart.entity";
import { Product } from "../products/product.entity";

@Injectable()
export class CartItemService{
    constructor(
        @InjectRepository(CartItem)
        private cartItemRepository : Repository<CartItem>, 

        private readonly productService : ProductService,
    ){}
    //method
    async addCartItem(cart: Cart, productId: number, quantity: number) : Promise<CartItem>{
        console.log('Type of cart', typeof cart);
        console.log('Type of ProductId', typeof productId);
        console.log('Type of quantity', typeof quantity);
        console.log(cart);
        const cartItem = cart.cartItems;
        console.log(cartItem);
        const product =  await this.productService.findProductById(productId);
        if(!product){
            throw new Error ('Product ko co trong database');
        }
        console.log(product);
        console.log(productId);
        //Kiem tra xem product da co trong gio hang hay chua
        const existingCartItem = cart.cartItems.find(item => item.product.id === productId);
        if(existingCartItem){
            existingCartItem.quantity += quantity;
            existingCartItem.subtotal = existingCartItem.priceAddTime * existingCartItem.quantity;
            console.log(existingCartItem.priceAddTime);
            console.log(typeof(existingCartItem.priceAddTime));
            console.log(existingCartItem.subtotal);
            console.log(typeof(existingCartItem.subtotal));
            return await this.cartItemRepository.save(existingCartItem);
        }else{
            const newCartItem = this.cartItemRepository.create();
            newCartItem.product = product;
            newCartItem.quantity = quantity;
            newCartItem.cart = cart;
            newCartItem.priceAddTime = product.price;
            newCartItem.subtotal = product.price * quantity;
            cart.cartItems.push(newCartItem);
            return await this.cartItemRepository.save(newCartItem);
        }
    }

    async updateCartItem(cartItem : CartItem) : Promise<CartItem>{
        return await this.cartItemRepository.save(cartItem);
    }

    async removeCartItem(cartItem : CartItem) : Promise<void>{
        await this.cartItemRepository.remove(cartItem);
    }
}