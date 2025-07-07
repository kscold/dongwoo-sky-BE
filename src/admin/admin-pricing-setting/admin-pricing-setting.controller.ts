import {
    Controller,
    Get,
    Put,
    Body,
    UseGuards,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { AdminPricingSettingService } from './admin-pricing-setting.service';
import { AdminPricingSettingUpdateRequestDto } from './dto/request/admin-pricing-setting-update-request.dto';
import { AdminPricingSettingResponseDto } from './dto/response/admin-pricing-setting-response.dto';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { RolesGuard } from '../../common/guard/roles.guard';
import { Roles } from '../../common/decorator/roles.decorator';
import { UserRole } from '../../schema/user.schema';

@Controller('admin/pricing-setting')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminPricingSettingController {
    constructor(
        private readonly adminPricingSettingService: AdminPricingSettingService,
    ) { }

    @Get()
    async getPricingSettings(): Promise<AdminPricingSettingResponseDto> {
        try {
            return await this.adminPricingSettingService.getPricingSettings();
        } catch (error) {
            throw new HttpException(
                'Pricing 설정을 가져오는 중 오류가 발생했습니다.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Put()
    async updatePricingSettings(
        @Body() updateDto: AdminPricingSettingUpdateRequestDto,
    ): Promise<AdminPricingSettingResponseDto> {
        try {
            return await this.adminPricingSettingService.updatePricingSettings(
                updateDto,
            );
        } catch (error) {
            throw new HttpException(
                'Pricing 설정을 업데이트하는 중 오류가 발생했습니다.',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
} 