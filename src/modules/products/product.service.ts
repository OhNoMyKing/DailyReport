import { Body, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { Product } from "./product.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { CategoryService } from "../category/category.service";
import { addCategoryDto } from "../category/dto/addCategoryDto";
import { Category } from "../category/category.entity";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {Redis }  from "cache-manager-ioredis";
import { RedisService } from "src/cache/redis.service";
import { UpdateProductDto } from "./dto/update-product.dto";
import { plainToClass } from 'class-transformer';
@Injectable()
export class ProductService{
    constructor(
        @InjectRepository(Product)
        private productRepository : Repository<Product>,
        private entityManager : EntityManager,
        private categoryService: CategoryService,
        private redisService : RedisService,
    ){}
    //findAllProducts
    async findAllProducts() : Promise<Product []>{
        const  redisProducts = await this.redisService.getAllProducts();
        if(redisProducts != null){
            return redisProducts;
        }
        const query = `
            SELECT p.*, c.name AS category_name
            FROM products p
            LEFT JOIN category c ON p.category_id = c.id
        `;
        const listProducts = await this.entityManager.query(query);
        console.log(listProducts);
        this.redisService.saveAllProducts(listProducts);
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
            categories = result;
        }
        //tao product moi
        const query = 
        `
            INSERT INTO products (name,description,price,stock,category_id) 
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *
        `
        console.log(categories[0].id);
        const value = [createProducts.name,createProducts.description,createProducts.price,createProducts.stock,categories[0].id];
        console.log(query);
        const newProduct = await this.entityManager.query(query,value);
        return newProduct;
    }
    //update products
    async updateProduct(id:number, updateProductDto : UpdateProductDto) : Promise<Product>{
        //tim product trong database
        const product = await this.productRepository.findOne({where : {id}});
        if(!product){
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        //kiem tra Category trong productDTO
        if(updateProductDto.category_id !== undefined){
            const category = await this.categoryService.findCategoryById(updateProductDto.category_id);
            if(!category){
                throw new NotFoundException(`Category with ID ${updateProductDto.category_id} not found`);
            }
        }
        //tao SQL  cho update Product
        const fields = [];
        const values = [];
        let setClause = '';
        //Duyet ProductDTO va truyen agrument cho sql
        if(updateProductDto.name){
            fields.push('name = $1');
            values.push(updateProductDto.name);
        }
        if(updateProductDto.description){
            fields.push('description = $2');
            values.push(updateProductDto.description);
        }
        if(updateProductDto.price !== undefined){
            fields.push('price = $3');
            values.push(updateProductDto.price);
        }
        if(updateProductDto.stock !== undefined){
            fields.push('stock = $4');
            values.push(updateProductDto.stock);
        }
        //xay dung phan SET trong SQL Update'
        setClause = fields.join(',');
        //SQL cap nhat product
        const query =`
            UPDATE products
            SET ${setClause}
            WHERE id = $${fields.length+1}
            RETURNING *;
        `
        values.push(id);
        console.log(query);
        const updaeProduct = await this.entityManager.query(query,values);
        console.log(updaeProduct);
        console.log("updateProduct: ",updaeProduct[0]);
        const productUpdate = plainToClass(Product,updaeProduct[0][0]);
        productUpdate.category = await this.categoryService.findCategoryById(updaeProduct[0][0].category_id);
        console.log(productUpdate);
        console.log(productUpdate instanceof Product);
        console.log(productUpdate.getDetails()); // Kết quả: "Hôi quas ik - Chua loét (300)"
        return updaeProduct[0][0];
    }

    //update 2
    async updateProduct2(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
        // Tìm sản phẩm trong cơ sở dữ liệu
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
    
        // Kiểm tra Category trong productDTO
        if (updateProductDto.category_id !== undefined) {
            const category = await this.categoryService.findCategoryById(updateProductDto.category_id);
            if (!category) {
                throw new NotFoundException(`Category with ID ${updateProductDto.category_id} not found`);
            }
        }
    
        // Cập nhật các trường trong sản phẩm
        if (updateProductDto.name) {
            product.name = updateProductDto.name;
        }
        if (updateProductDto.description) {
            product.description = updateProductDto.description;
        }
        if (updateProductDto.price !== undefined) {
            product.price = updateProductDto.price;
        }
        if (updateProductDto.stock !== undefined) {
            product.stock = updateProductDto.stock;
        }
    
        // Lưu sản phẩm đã cập nhật (điều này sẽ gọi các subscriber)
        const updatedProduct = await this.productRepository.save(product);
        return updatedProduct;
    }
    //findProductById
    async findProductById(id : number) : Promise<Product>{
        return this.productRepository.findOne({
            where : {id},
        })
    }
    //
    async getProductsToCount() : Promise<number>{
        const query =`
            SELECT COUNT(*)
            FROM products;
        `
        const result = await this.entityManager.query(query);
        return result[0];
    }
}