import { Controller, Req, UseGuards ,Get} from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guards/jwt-auth-guard";
@Controller('users')
export class UserController{
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req){
        return req.user;
    }

    @Get('products')
    findAllProducts(){

    }
}