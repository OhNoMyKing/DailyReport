import { Module } from "@nestjs/common";
import { TypeOrmModule} from "@nestjs/typeorm";
import { User } from "../users/user.entity";
import { UserService } from "../users/user.service";
import { UserController } from "../users/user.controller";
import { PassportModule } from "@nestjs/passport";
import { JwtAuthGuard } from "src/common/guards/jwt-auth-guard";
import { AuthModule } from "../auth/auth.module";
import { Role } from "../roles/role.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, Role]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule
    ],
    providers: [UserService],
    controllers: [UserController],
    exports:[UserService]
})
export class UserModule{}
