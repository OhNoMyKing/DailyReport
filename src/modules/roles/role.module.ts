import { Module } from "@nestjs/common";
import { Role } from "../roles/role.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoleService } from "../roles/role.service";
import { RoleController } from "../roles/role.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Role])],
    providers:[RoleService],
    controllers: [RoleController],
})
export class RoleModule{}