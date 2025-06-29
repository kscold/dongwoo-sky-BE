import { Controller, Get } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { LandingPageService } from './home.service';

import { JwtAuthGuard } from '../../admin/admin-user/guard/jwt-auth.guard';
import { RolesGuard } from '../../admin/admin-user/guard/roles.guard';
import { Roles } from '../../admin/admin-user/decorator/roles.decorator';
import { UserRole } from '../../schema/user.schema';

@Controller('home')
export class LandingPageController {
  constructor(private readonly landingPageService: LandingPageService) {}

  // Public API - 현재 활성화된 랜딩 페이지 데이터 조회
  @Get('')
  async getCurrentLandingPage(): Promise<LandingPage> {
    return this.landingPageService.getMainPageData();
  }
}
