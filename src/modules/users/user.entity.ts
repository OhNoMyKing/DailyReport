import { Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../roles/role.entity";
import { Cart } from "../cart/cart.entity";

@Entity('users')
export class User{
    @PrimaryGeneratedColumn({name:'id'})
    id: number;
    @Column({name:'name'})
    username:string;
    @Column({name:'password'})
    password:string;
    @Column({name:'active', default: true})
    isActive: boolean;
    //Realation Role
    @ManyToMany(()=>Role)
    @JoinTable({
        name:'user_role',
        joinColumn:{
            name: 'user_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn:{
            name: 'role_id',
            referencedColumnName: 'id',
        },
    })
    roles:Role[];
    //Realation Cart
    @OneToOne(() => Cart, (cart) => cart.user)
    cart : Cart;
}