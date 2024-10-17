import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Controller('auth')
export class AuthController{
    constructor(
        private readonly authService: AuthService,
    ){}
    //method
    @Post('signup')
    async signUp(@Body() registerDto : RegisterDto) : Promise<string>{
        const user = await this.authService.signUp(registerDto);
        const username = user.username;
        return `${username}  da SignUp thanh cong`;
    }
    @Post('signin')
    async signIn(@Body() loginDto: LoginDto) : Promise<{access_token : string,refresh_token:string}>{
        return  await this.authService.signIn(loginDto);
    }
    //method khi het han token
    @Post('refresh')
    async refresh(@Body('refresh_token') refresh_Token: string) : Promise<{access_token : string, refresh_token:string}>{
        return await this.authService.refresh(refresh_Token);
    }
}