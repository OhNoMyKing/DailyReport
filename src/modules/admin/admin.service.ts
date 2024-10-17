import { Injectable } from "@nestjs/common";
import { ProductService } from "../products/product.service";

@Injectable()
export class AdminService{
    constructor(
        private productService : ProductService
    ){}
    
}