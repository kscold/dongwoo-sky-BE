import { Controller, Get, Param, Patch, UseGuards, Put, Body, Query } from '@nestjs/common';

import { Roles } from '../../common/decorator/roles.decorator';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../common/guard/roles.guard';

import { AdminContactService } from './admin-contact.service';
import { ContactService } from '../../service/contact/contact.service';

import { UserRole } from '../../schema/user.schema';

import { AdminContactListResponseDto } from './dto/response/admin-contact-list-response.dto';

@Controller('admin/contact')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminContactController {
  constructor(
    private readonly adminContactService: AdminContactService,
    private readonly contactService: ContactService,
  ) {}

  @Get('list')
  async getContactList(): Promise<AdminContactListResponseDto> {
    return this.adminContactService.getContactList();
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.adminContactService.markAsRead(id);
  }

  @Get('settings')
  async getContactSettings() {
    return await this.contactService.getContactSettings();
  }

  @Get('inquiries')
  async getAllInquiries(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.contactService.getAllInquiries(page, limit);
  }
}
