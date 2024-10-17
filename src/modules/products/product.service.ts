import { Body, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { Product } from "./product.entity";
import { CreateProductDto } from "./dto/product.dto";
import { CategoryService } from "../category/category.service";
import { addCategoryDto } from "../category/dto/addCategoryDto";

@Injectable()
export class ProductService{
    constructor(
        @InjectRepository(Product)
        private productRepository : Repository<Product>,
        private entityManager : EntityManager,
        private categoryService: CategoryService,
    ){}
    //findAllProducts
    async findAllProducts() : Promise<Product []>{
        const query = `
            SELECT p.*, c.name AS category_name
            FROM products p
            LEFT JOIN category c ON p.category_id = c.id
        `;
        const listProducts = await this.entityManager.query(query);
        console.log(listProducts);
        return listProducts;
    }
    //crud products
    //addProduct
    async createProduct(@Body() createProducts : CreateProductDto) : Promise<Product>{
        const {categoryName,descriptionCategory} = createProducts;
        let categories = await this.categoryService.findCategoryByName(categoryName);
        console.log(categories);
        if(categories.length === 0){
            const categoryDto = {
                name: categoryName,
                description: descriptionCategory
            };
           const result = await this.categoryService.addCategory([categoryDto]);
            categories = result[0];
        }
        //tao product moi
        const query = 
        `
            INSERT INTO products (name,description,price,stock,category_id) 
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *
        `
        console.log(categories.id);
        const value = [createProducts.name,createProducts.description,createProducts.price,createProducts.stock,categories[0].id];
        console.log(query);
        const newProduct = await this.entityManager.query(query,value);
        return newProduct;
    }
}