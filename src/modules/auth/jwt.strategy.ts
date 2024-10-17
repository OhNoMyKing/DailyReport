import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../users/user.service"; // Thay đổi đường dẫn nếu cần
import { JwtPayload } from "jsonwebtoken";



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService, private jwtService: JwtService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'Hello', // Sử dụng secret để xác thực
        });
    }

    async validate(payload: JwtPayload) {
        // Tìm kiếm người dùng từ payload
        const user = await this.userService.findById(Number(payload.sub));
        if (!user) {
            throw new UnauthorizedException();
        }
        return user; // Trả về người dùng nếu tìm thấy
    }
}
