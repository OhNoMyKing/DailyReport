import { Body, Controller, Get, Post } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/product.dto";

@Controller('products')
export class ProductController{
    constructor(private productService : ProductService){

    }
    @Get('find-all')
    async findAllProducts(){
        const listProducts = await this.productService.findAllProducts();
        return listProducts;
    }
    @Post('create')
    async createProduct(@Body() createProducts : CreateProductDto){
        return this.productService.createProduct(createProducts);
    }
}