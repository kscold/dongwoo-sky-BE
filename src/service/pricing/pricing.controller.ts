import { Controller, Get } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { Equipment } from 'src/schema/equipment.schema';

@Controller('service/pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get()
  async getEquipmentsForPricing(): Promise<Equipment[]> {
    return this.pricingService.getEquipmentsForPricing();
  }
}
