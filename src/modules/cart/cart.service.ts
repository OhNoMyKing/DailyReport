import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Cart } from "./cart.entity";
import { InjectConnection, InjectDataSource, InjectRepository} from "@nestjs/typeorm";
import { Connection, DataSource, Repository } from "typeorm";
import { CartItemService } from "../cart-item/cart-item.service";
import { CartItem } from "../cart-item/cart-item.entity";
import { ProductService } from "../products/product.service";

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

    async addProductToCart2(userId: number, productId: number, quantity: number){
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try{
            await queryRunner.query(`
                DO $$
                DECLARE
                    cart_id INT;
                    stock INT;
                    price DECIMAL(10,2);
                    existing_cart_item_id INT;
                BEGIN
                    --1.Lay cart tu user_id
                    SELECT id INTO cart_id FROM cart WHERE user_id = $1 FOR UPDATE;
                    --2.Neu khong co gio hang, tao gio hang moi
                    IF cart_id IS NULL THEN
                        INSERT INTO cart (user_id) VALUES ($1) RETURNING id INTO cart_id;
                    END IF;

                    -- 3. Kiem tra so luong ton kho
                    SELECT stock,price INTO stock,price
                    FROM product
                    WHERE id = $2 FOR UPDATE;
                    --Neu product khong ton tai
                    IF stock IS NULL THEN
                        RAISE EXCEPTION 'product not found';
                    END IF;

                    --kiem tra so luong ton kho--
                    IF stock < $3 THEN
                        RAISE EXCEPTION 'Product khong du cho yeu cau cua ban';
                    END IF;
                    -- 4 Kiem tra san pham trong gio hang
                    SELECT id INTO existing_cart_item_id
                    FROM cart_item
                    WHERE cart_id = cart_id AND product_id = $2;
                    --5 Neu product da co trong gio hang
                    IF existing_cart_item id IS NOT NULL THEN
                        IF(SELECT quantity FROM cart_item WHERE id = existing_cart_item_id) + $3 > stock THEN
                            RAISE EXCEPTION 'So luong khi them vuot qua product';
                        END IF;
                        UPDATE cart_item
                        SET quantity = quantity + $3
                        WHERE id = existing_cart_item_id;
                    ELSE
                        --tao san pham product vao gio hang
                        INSERT INTO cart_item (cart_id, product_id,quantity,price_add_time)
                        VALUES (cart_id, $2,$3,price);
                    END IF;

                    --Commit Transaction
                    COMMIT;
                END $$;

            `,[userId,productId,quantity]);
            return {message : 'Product added to cart successfully'};
        } catch(error){
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException(error.message);
        }  finally{
            await queryRunner.release();
        }
    }
}