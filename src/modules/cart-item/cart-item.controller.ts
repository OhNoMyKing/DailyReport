import { Controller, Get } from "@nestjs/common";
import { CartItemService } from "./cart-item.service";
import { ApiTags } from "@nestjs/swagger";
@ApiTags('cart-items')
@Controller('cart-items')
export class CartItemController{
    constructor(private readonly cartItemService : CartItemService){}
    @Get()
    async findAll(){

    }
}