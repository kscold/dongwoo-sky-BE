import { Controller, Get } from '@nestjs/common';
import { PricingService } from './pricing.service';

import { PricingEquipmentResponseDto } from './dto/pricing-equipment-response.dto';

@Controller('pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  // 이용요금 페이지에서 필요한 장비 정보 반환
  @Get('equipments')
  async getEquipments(): Promise<PricingEquipmentResponseDto[]> {
    return this.pricingService.getEquipments();
  }
}
