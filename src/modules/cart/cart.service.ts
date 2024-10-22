import { Injectable } from "@nestjs/common";
import { Cart } from "./cart.entity";
import { InjectConnection, InjectDataSource, InjectRepository} from "@nestjs/typeorm";
import { Connection, DataSource, Repository } from "typeorm";
import { CartItemService } from "../cart-item/cart-item.service";
import { CartItem } from "../cart-item/cart-item.entity";
import { ProductService } from "../products/product.service";
import e from "express";

@Injectable()
export class CartService{
    constructor(
        @InjectRepository(Cart)
        private cartRepository : Repository<Cart>,
        private cartItemService : CartItemService,
        private productService : ProductService,
        @InjectDataSource()
        private readonly dataSource : DataSource
    ){}
    async addProductToCart(userId:number, productId: number, quantity: number){
        let cartUser = await this.cartRepository.findOne({
            where : {
                user : {id : userId},
            },
            relations : ['cartItems','cartItems.product'],
        });

        if(!cartUser){
            cartUser = this.cartRepository.create({
                user: {id : userId},
                totalPrice: 0,
                cartItems: []
            });
            await this.cartRepository.save(cartUser);
        }
        await this.cartItemService.addCartItem(cartUser,productId,quantity);
        cartUser.totalPrice = cartUser.cartItems.reduce((total,item) =>{
            return total + (item.subtotal) ;
        },0);
        await this.cartRepository.save(cartUser);
    }

    async getCart(userId : number) : Promise<Cart>{
        const cartUser = await this.cartRepository.findOne({
            where :{
                user : {id : userId},
            },
            relations: ['cartItems','cartItems.product'],
        });
        if(!cartUser){
            throw new Error('Cart not found ');
        }
        return cartUser;
    }    
    
    async updateCartItem(userId :number, productId : number, quantity : number) {
        const cartUser = await this.cartRepository.findOne({
            where : {
                user :{id : userId},
            },
            relations: ['cartItems','cartItems.product'],
        });
        if(!cartUser){
            throw new Error('Cart not found');
        }
        const existingCartItem = cartUser.cartItems.find(item => item.product.id === productId);
        if(!existingCartItem){
            throw new Error('Product not found in cart');
        }
        if(quantity === 0){
            //neu so luong la 0, xoa san pham khoi gio hang
            cartUser.cartItems = cartUser.cartItems.filter(item => item.product.id !== productId);
            await this.cartItemService.removeCartItem(existingCartItem);
        } else{
            existingCartItem.quantity = quantity;
            existingCartItem.subtotal = existingCartItem.priceAddTime * quantity;
            await this.cartItemService.updateCartItem(existingCartItem);
        }

        //Cap nhat tong gio hang
        cartUser.totalPrice = cartUser.cartItems.reduce((total,item) =>{
            return total + item.subtotal;
        },0);
        await this.cartRepository.save(cartUser);
    }
}