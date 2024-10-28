import { Controller, Request, Body, Post, Get, Param, UseGuards } from "@nestjs/common";
import { CartService } from "./cart.service";
import { JwtAuthGuard } from "src/common/guards/jwt-auth-guard";
import { ApiTags } from "@nestjs/swagger";
@ApiTags('cart')
@Controller('cart')
export class CartController{
    constructor (private readonly cartService : CartService){}
    @Post('add')
    @UseGuards(JwtAuthGuard)
    async addProductToCart(@Request() req, @Body() body : {productId: number, quantity: number}){
        const userId = req.user.id;
        this.cartService.addProductToCart(userId,body.productId,body.quantity);
    }
    @Post('update')
    @UseGuards(JwtAuthGuard)
    async updateCartItem(@Request() req, @Body() body :{productId : number, quantity: number}){
        const userId = req.user.id;
        this.cartService.updateCartItem(userId,body.productId,body.quantity);
    }
    @Get('find-all/:id')
    async findAllCart(@Param('id') id : number){
        return this.cartService.getCart(id);
    }
    @Post('add2')
    @UseGuards(JwtAuthGuard)
    async addProductToCart2(@Request() req, @Body() body : {productId: number, quantity: number}){
        const userId = req.user.id;
        this.cartService.addProductToCart2(userId,body.productId,body.quantity);
    }
}