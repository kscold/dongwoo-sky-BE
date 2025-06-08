import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminAuthGuard } from './guards/admin-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async login(@Body() adminLoginDto: AdminLoginDto) {
    return this.adminService.login(adminLoginDto);
  }

  @Get('dashboard')
  @UseGuards(AdminAuthGuard)
  async getDashboard(@Request() req) {
    return {
      success: true,
      message: '관리자 대시보드에 접근했습니다.',
      admin: req.admin,
      stats: {
        totalNotices: 0, // NoticesService에서 가져올 수 있음
        publishedNotices: 0,
        modalNotices: 0,
      },
    };
  }

  @Post('logout')
  @UseGuards(AdminAuthGuard)
  async logout() {
    return {
      success: true,
      message: '로그아웃되었습니다.',
    };
  }
}
