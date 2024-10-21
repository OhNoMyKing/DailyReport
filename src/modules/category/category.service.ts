import { Injectable } from "@nestjs/common";
import { Category } from "./category.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { addCategoryDto } from "./dto/addCategoryDto";

@Injectable()
export class CategoryService{
    constructor(
        @InjectRepository(Category)
        private categoryRepository : Repository<Category>,
        private entityManager : EntityManager,
    ){}

    //findAllCategory
    async findAllCategory() : Promise<Category[]>{
        const query = `
            SELECT * FROM category;
        `
        const listCategory = await this.entityManager.query(query);
        const result = listCategory.map(category => Object.assign(new Category(), category));
        return result;
    }
    //crud category
    //addCategory use Async/await
    async addCategory(categories : addCategoryDto[]) : Promise<Category[]>{
        const createdCategories = [];
        for(let i=0 ;i<categories.length;i++){
            const categoryDto = categories[i];
            console.log(categoryDto);
            const query =`
            INSERT INTO category(name,description)
            VALUES($1,$2)
            RETURNING *
        `
        const value  = [categoryDto.name,categoryDto.description];
        console.log(value);
        const createCategory = await this.categoryRepository.query(query,value);
        createdCategories.push(createCategory[0]);
        console.log(createdCategories);
        }
        return createdCategories;
    }
    //addCategory use Promise.all
    async addCategory2(categories: addCategoryDto[]) : Promise<Category[]>{
        const promises = categories.map( async categoryDto =>{
            const query = 
                `
                 INSERT INTO category(name,description)
                 VALUES ($1,$2)
                 RETURNING *;
                `
                const values = [categoryDto.name,categoryDto.description];
                const category = await this.entityManager.query(query,values);
                return Object.assign(new Category(),category[0]);
                // return this.categoryRepository.query(query,values);
        });
        //use promises.all 
        const createdCategories = await Promise.all(promises);
        return createdCategories;
    }
    async findCategoryById(id: number) : Promise<Category>{
        const query =`
            SELECT * FROM category WHERE id = ${id}
        `
        console.log(query);
        const categories = await this.entityManager.query(query);
        if(!categories){
            throw new Error('Category not found');
        }
        return Object.assign(new Category(), categories[0]);
    }
    //update category
    async updateCategory(id: number, updateCategory : addCategoryDto) : Promise<Category>{
        const categories = this.findCategoryById(id);
        if(!categories){
            throw new Error('category not found to update')
        }
        const query = `
            UPDATE category 
            SET name = $1, description = $2
            WHERE id = $3
            RETURNING *
        `;
        const values = [updateCategory.name,updateCategory.description,id];
        const result = await this.entityManager.query(query,values);
        console.log(query);
        if(result.length===0){
            throw new Error('Failed to update category');
        }
        const result2 = Object.assign(new Category(), result[0]);
        return result2;
    }
    //findcategoryByname
    async findCategoryByName(name:string) : Promise<Category[]>{
        const query =
        `
            SELECT * FROM category WHERE name = $1
        `
        const categories = await this.entityManager.query(query,[name]);
        console.log(categories);
        console.log(query);
        if(!categories){
            throw new Error('loi tim name category');
        }
        return categories;
    }
    //
}