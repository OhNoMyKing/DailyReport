import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

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
    @Post('update/:id')
    async updateProduct(@Param('id')id : number,@Body() updateProduct : UpdateProductDto){
        return this.productService.updateProduct2(id,updateProduct);
    }
}