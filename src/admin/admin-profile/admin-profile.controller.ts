import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../admin-user/guard/jwt-auth.guard';
import { RolesGuard } from '../admin-user/guard/roles.guard';
import { Roles } from '../admin-user/decorator/roles.decorator';

import { AdminProfileService } from './admin-profile.service';

import { UserRole } from '../../schema/user.schema';

import { AdminProfileUpdateDto } from './dto/request/admin-profile-update.dto';
import { AdminProfileResponseDto } from './dto/response/admin-profile.response.dto';

@Controller('admin-profile')
export class AdminProfileController {
  constructor(private readonly adminProfileService: AdminProfileService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getProfile(): Promise<AdminProfileResponseDto> {
    const result = await this.adminProfileService.getProfile();
    return result.data;
  }

  @Patch()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateProfile(
    @Body() updateProfileDto: AdminProfileUpdateDto,
  ): Promise<AdminProfileResponseDto> {
    const result =
      await this.adminProfileService.updateProfile(updateProfileDto);
    return result.data;
  }
}
