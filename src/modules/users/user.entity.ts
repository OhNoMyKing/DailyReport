import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "../roles/role.entity";

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
    //
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
}