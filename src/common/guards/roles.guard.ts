// src/common/roles.guard.ts
import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../enum/roles.enum';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
    canActivate(context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.get<RoleEnum[]>('roles', context.getHandler());
      console.log('requiredRoles:', requiredRoles); // Kiểm tra giá trị requiredRoles
    
      if (!requiredRoles) {
        return true; // Nếu không có yêu cầu quyền, cho phép truy cập
      }
    
      const request = context.switchToHttp().getRequest();
      const user = request.user; // Người dùng đã xác thực qua JWT
      console.log('user.roles:', user.roles.map(role => role.name)); // Kiểm tra giá trị user.roles
    
      // Kiểm tra vai trò của người dùng có khớp với yêu cầu không
      const hasRole = user && user.roles.some((role) => {
        return requiredRoles.includes(role.name); // Trả về kết quả so sánh
      });
    
      if (!hasRole) {
        throw new ForbiddenException("khong co quyen admin");
      }
    
      return true; // Cho phép truy cập nếu có quyền
    }
    
  }
  