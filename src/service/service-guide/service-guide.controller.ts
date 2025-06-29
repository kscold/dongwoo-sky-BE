import { Controller, Get } from '@nestjs/common';

import { ServiceGuideService } from './service-guide.service';

import { ServiceGuideEquipmentResponseDto } from './dto/service-guide-equipment-response.dto';

@Controller('service-guide')
export class ServiceGuideController {
  constructor(private readonly serviceGuideService: ServiceGuideService) {}

  // 서비스 안내 페이지에서 필요한 장비 정보만 반환
  @Get('equipment')
  async getEquipments(): Promise<ServiceGuideEquipmentResponseDto[]> {
    return this.serviceGuideService.getEquipments();
  }
}
