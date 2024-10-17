import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../users/user.service";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { User } from "../users/user.entity";

@Injectable()
export class AuthService{
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ){
        
    }
    async signUp(registerDto : RegisterDto) : Promise<User>{
        return await this.userService.createUser(registerDto);

    }
    async signIn(loginDTO : LoginDto) : Promise<{access_token:string, refresh_token:string}>{
        // console.log('JWT_SECRET:', process.env.JWT_SECRET);
        // console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET);

        const user = await this.userService.findByUser(loginDTO);
        const payload = {sub: user.id, username: user.username, roles: user.roles.map(role => role.name)};
        const access_token = await this.jwtService.signAsync(payload,{
            // secret: process.env.JWT_SECRET,
            secret:'Hello',
            expiresIn: '3m',
        });

        const refresh_token = await this.jwtService.signAsync(payload,{
            secret: 'Hi',
            expiresIn: '7m',
        });
        return {access_token,refresh_token};
    }

    async refresh(refresh_Token:string){
        try{
            const payload = await this.jwtService.verifyAsync(refresh_Token,{
                secret: 'Hi',
            });
        const user = await this.userService.findById(payload.sub);
        //tao accesstoken va refresh token moi
        const newAccessToken = await this.jwtService.signAsync(
            {sub: user.id, username: user.username},
            {secret: 'Hello', expiresIn: '3m'}
        );
        const newRefreshToken = await this.jwtService.signAsync(
            {sub: user.id, username: user.username},
            {secret: 'Hi',expiresIn: '7m'}
        );
        return{
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
        }
        }catch(error){
            throw new UnauthorizedException('refresh token sai ' + error);
        }
    }
}