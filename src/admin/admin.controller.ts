import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schema/user.schema';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboard(@CurrentUser() user: any) {
    return {
      success: true,
      message: '관리자 대시보드에 접근했습니다.',
      user: user,
      stats: {
        totalNotices: 0, // NoticesService에서 가져올 수 있음
        publishedNotices: 0,
        modalNotices: 0,
      },
    };
  }

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return {
      success: true,
      user: user,
    };
  }
}
