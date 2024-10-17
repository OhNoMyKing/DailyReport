import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RoleEnum } from 'src/common/enum/roles.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard,RolesGuard) // Áp dụng guard cho toàn bộ controller
export class AdminController {
  @Get('dashboard')
  @Roles(RoleEnum.ADMIN) // Chỉ cho phép người dùng có quyền Admin truy cập
  getAdminDashboard() {
    return "Welcome to the admin dashboard!";
  }
}
