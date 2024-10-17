import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../category/category.entity";

@Entity({name:'products'})
export class Product{
    @PrimaryGeneratedColumn({name:'id'})
    id : number;
    @Column({name:'name'})
    name: string;
    @Column({name:'description'})
    description: string;
    @Column({name: 'price'})
    price: number;
    @Column({name:'stock'})
    stock: number;
    @ManyToOne(()=> Category, (category) => category.products)
    @JoinColumn({name: 'category_id'})
    category: Category;
}