import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../products/product.entity";

@Entity({name:'category'})
export class Category{
    @PrimaryGeneratedColumn({name:'id'})
    id: number;
    @Column({name:'name'})
    name: string;
    @Column({name:'description'})
    description: string;
    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}