import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { Observable } from "rxjs";
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){
//     constructor(private jwtService: JwtService){
//         super();
//     }

//     canActivate(context: ExecutionContext): boolean {
//         const request = context.switchToHttp().getRequest<Request>();
//         const token = this.extractTokenFromHeader(request);
//         console.log(token);
//         if(!token){
//             throw new UnauthorizedException('token la null');
//         }
//             const payload =  this.jwtService.verify(token,{
//                 secret:'Hello',
//             }
//         );
//             request.user = payload;
//             return true;
        

//     }
    

//     //method custom
//     private extractTokenFromHeader(request:Request) : string | null{
//         const authHeader = request.headers.authorization;
//         if(!authHeader) return null;
//         const [bearer,token] = authHeader.split(' ');
//         return bearer == 'Bearer' ? token : null;
//     }
// }
    constructor(){super()};
}