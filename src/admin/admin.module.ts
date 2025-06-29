import { Module } from '@nestjs/common';
import { AdminController } from './admin-default/admin.controller';
import { AdminService } from './admin-default/admin.service';
import { AuthModule } from '../common/auth/auth.module';
import { AdminAuthGuard } from '../common/auth/guards/admin-auth.guard';

@Module({
  imports: [AuthModule],
  controllers: [AdminController],
  providers: [AdminService, AdminAuthGuard],
  exports: [AdminService, AdminAuthGuard, AuthModule],
})
export class AdminModule {}
