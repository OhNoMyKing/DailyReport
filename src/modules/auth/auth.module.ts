
import { UserService } from "../users/user.service";
import { AuthService } from "./auth.service";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../users/user.entity";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtAuthGuard } from "src/common/guards/jwt-auth-guard";
import { JwtStrategy } from "./jwt.strategy";
import { Role } from "../roles/role.entity";
@Module({
    imports:[
        TypeOrmModule.forFeature([User,Role]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
        }), 
    ],
    controllers:[AuthController],
    providers: [AuthService,UserService,JwtAuthGuard,JwtService,JwtStrategy],
    exports:[AuthService,JwtService,JwtStrategy],
})
export class AuthModule{
}