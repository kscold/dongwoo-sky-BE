import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';

import { Roles } from '../../common/decorator/roles.decorator';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../common/guard/roles.guard';

import { AdminContactService } from './admin-contact.service';

import { UserRole } from '../../schema/user.schema';

import { AdminContactListResponseDto } from './dto/response/admin-contact-list-response.dto';

@Controller('admin/contact')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminContactController {
  constructor(private readonly adminContactService: AdminContactService) {}

  @Get('list')
  async getContactList(): Promise<AdminContactListResponseDto> {
    return this.adminContactService.getContactList();
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string): Promise<{ success: boolean }> {
    return this.adminContactService.markAsRead(id);
  }
}
