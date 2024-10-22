import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { Category } from "./category.entity";
import { addCategoryDto } from "./dto/addCategoryDto";
import { ApiTags } from "@nestjs/swagger";
@ApiTags('category')
@Controller('category')
export class CategoryController{
    constructor(private categoryService : CategoryService){}
    @Get()
    async findAllCategory() : Promise<Category[]>{
        const listCategory = await this.categoryService.findAllCategory();
        return listCategory;
    }
    @Post('add')
    async addCategory(@Body() categories : addCategoryDto[] | addCategoryDto) : Promise<Category[]>{
        const categoryArray =  Array.isArray(categories) ? categories : [categories];
        const listCategory = await this.categoryService.addCategory(categoryArray);
        return listCategory;
    }

    @Get(':id')
    async findCategoryById(@Param('id') id : number){
        return this.categoryService.findCategoryById(id);
    }

    @Post('update')
    async updateCategory(@Query('id') id:number, @Body()categories : addCategoryDto){
        return this.categoryService.updateCategory(id,categories);
    }
}