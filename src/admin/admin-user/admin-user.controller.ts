import { Controller, Post, Body, Get, Patch, UseGuards } from '@nestjs/common';
import { AdminUserService } from './admin-user.service';
import { AdminLoginDto } from './dto/request/admin-login.dto';
import { AdminLoginResponseDto } from './dto/response/admin-login-response.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { RolesGuard } from './guard/roles.guard';
import { Roles } from './decorator/roles.decorator';
import { UserRole } from '../../schema/user.schema';
import { AdminUserListResponseDto } from './dto/response/admin-user-list-response.dto';
import { AdminApproveUserDto } from './dto/request/admin-approve-user.dto';

@Controller('admin-user')
export class AdminUserController {
  constructor(private readonly adminUserService: AdminUserService) {}

  @Post('login')
  async login(@Body() loginDto: AdminLoginDto): Promise<AdminLoginResponseDto> {
    return this.adminUserService.login(loginDto);
  }

  @Get('list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getUserList(): Promise<AdminUserListResponseDto> {
    return this.adminUserService.getUserList();
  }

  @Patch('approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async approveUser(
    @Body() dto: AdminApproveUserDto,
  ): Promise<{ success: boolean }> {
    return this.adminUserService.approveUser(dto);
  }
}
