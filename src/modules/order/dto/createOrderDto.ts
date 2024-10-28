import { Cart } from "src/modules/cart/cart.entity";


export class CreateOrderDto{
    cartId : number;
    paymentMethod : string;
    shippingInfo: string;
    status: string;
}