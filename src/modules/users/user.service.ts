import { EntityManager, Repository } from "typeorm";
import { User } from "./user.entity";
import {ConflictException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectEntityManager, InjectRepository} from '@nestjs/typeorm';
import { LoginDto } from "../auth/dto/login.dto";
import { RegisterDto } from "../auth/dto/register.dto";
import * as bcrypt from 'bcrypt';
import { RoleEnum } from "src/common/enum/roles.enum";
import { Role } from "../roles/role.entity";
@Injectable()
export class UserService{
    constructor(
        @InjectRepository(User)
        private userRepository:Repository<User>,
        @InjectEntityManager()
        private entityManager: EntityManager,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
    ){}

    async createUser(registerDto : RegisterDto) : Promise<User>{
        const {username,password} = registerDto;
        //kiem tra user co ton tai hay khong
        const checkUser = await this.userRepository.findOne({where:{username,password}});
        if(checkUser){
            throw new ConflictException("User da ton tai");
        }
        //neu chua ton tai ma hoa password
        const hashedPassword = await bcrypt.hash(password,10);
        const userRole = await this.roleRepository.findOne({where : {name : RoleEnum.ADMIN}});
        const newUser = this.userRepository.create({username,
            password:hashedPassword,
            roles:[userRole],
        });
        return await this.userRepository.save(newUser);
    }
    async findByUser(loginDTO : LoginDto) : Promise<User>{
        const {username,password} = loginDTO;
        const user = await this.entityManager.findOne(User,{
            where:{
                username,
            },
            relations: ['roles'],
        });
        if(!user){
            throw new UnauthorizedException('User khong ton tai');
        }
        //neu tim thay User
        const isHashPassword = await bcrypt.compare(password,user.password);
        //net mat khau khong hop le, tra ve null
        if(!isHashPassword){
            throw new UnauthorizedException('Invalid password');
        }
        return user;
    }

    async findById(id:number) : Promise<User>{
        const user = await this.userRepository.findOne({
            where:{
                id,
            },
            relations: ['roles'],
        } );
        if(!user){
            throw new NotFoundException(`User co ID la ${id} khong ton tai`);
        }
        return user;
    }
}