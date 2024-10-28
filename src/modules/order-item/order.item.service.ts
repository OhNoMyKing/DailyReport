import { Injectable } from "@nestjs/common";
import { EntityManager, Repository } from "typeorm";
import { OrderItem } from "./order-item.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Cart } from "../cart/cart.entity";
import { query } from "express";

@Injectable()
export class OrderItemService{
    constructor(
        @InjectRepository(OrderItem)
        private orderItemRepository : Repository<OrderItem>,
        private entityManager : EntityManager
    ){}

    async createOrderItem(cart: Cart, order_id: number): Promise<OrderItem[]> {
        console.log(cart);
        console.log(cart.cartItems);
        
        const listCartItem = cart.cartItems;
        const query = `
            INSERT INTO order_item(product_id, quantity, subtotal, price, order_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
    
        const orderItemPromises = listCartItem.map(async (item) => {
            const productId = item.product.id;
            console.log(productId);
            
            const quantity = item.quantity;
            const subtotal = item.subtotal;
            console.log(typeof(subtotal));
            
            const price = item.priceAddTime;
            console.log(typeof(price));  // `price` sẽ là string
            
            const values = [productId, quantity, subtotal, price, order_id];
            const orderItemResult = await this.entityManager.query(query, values);
            return orderItemResult;
        });
    
        const listOrderItem = await Promise.all(orderItemPromises);  // Chờ tất cả promises hoàn thành
        console.log(listOrderItem);
        return listOrderItem;
    }

    async createOrderItem2(cart: Cart, order_id: number): Promise<OrderItem[]> {
        console.log(cart);
        console.log(cart.cartItems);
        
        const listCartItem = cart.cartItems;
        const query = `
            INSERT INTO order_item(product_id, quantity, subtotal, price, order_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `;
        
        const listOrderItem = [];
        for (let i = 0; i < listCartItem.length; i++) {
            const productId = listCartItem[i].product.id;
            console.log(productId);
            
            const quantity = listCartItem[i].quantity;
            const subtotal = (listCartItem[i].subtotal); // Chuyển thành số
            console.log(typeof(subtotal));
            
            // Chuyển số thành chuỗi có định dạng '0.00'
            const price = (listCartItem[i].priceAddTime);
            console.log(typeof(price));  // Lúc này `price` sẽ là string
            
            const values = [productId, quantity, subtotal, price, order_id];
            const orderItemResult = await this.entityManager.query(query, values);
            
            // Lỗi xảy ra ở đây: bạn đang thêm toàn bộ orderItemResult (một Promise) vào listOrderItem
            listOrderItem.push(orderItemResult);
            console.log(listOrderItem);
        }
        console.log(listOrderItem);
        return listOrderItem; // Đây là một mảng chứa các Promise chưa hoàn thành
    }
    
}