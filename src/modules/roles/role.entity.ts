import { RoleEnum } from "../../common/enum/roles.enum";
import { PrimaryGeneratedColumn,Entity, Column } from "typeorm";

@Entity('roles')
export class Role{
    @PrimaryGeneratedColumn({name:'id'})
    id: number;
    @Column({type: 'enum', enum: RoleEnum, unique:true, name:'role_name'})
    name: RoleEnum;
    @Column({nullable: true, name: 'role_description'})
    description: string;
}