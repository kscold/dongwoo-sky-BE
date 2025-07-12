import {
    Controller,
    Get,
    Body,
    Patch,
    UseGuards,
    HttpCode,
    HttpStatus,
} from "@nestjs/common"
import { AdminServiceGuideService } from "./admin-service-guide.service"
import { UpdateServiceGuideDto } from "./dto/update-service-guide.dto"
import { AdminAuthGuard } from "src/common/guard/admin-auth.guard"
import { ApiResponseDto } from "src/common/dto/response/api-response.dto"

@Controller("admin/service-guide")
@UseGuards(AdminAuthGuard)
export class AdminServiceGuideController {
    constructor(
        private readonly adminServiceGuideService: AdminServiceGuideService,
    ) { }

    @Get()
    async getServiceGuide() {


        return await this.adminServiceGuideService.findOrCreateServiceGuide()
    }

    @Patch()
    @HttpCode(HttpStatus.OK)
    async updateServiceGuide(@Body() updateDto: UpdateServiceGuideDto) {


        return await this.adminServiceGuideService.updateServiceGuide(updateDto)
    }
} 