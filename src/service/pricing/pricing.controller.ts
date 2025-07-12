import { Controller, Get } from '@nestjs/common';
import { PricingService } from './pricing.service';
import { Equipment } from 'src/schema/equipment.schema';
import { PricingSetting } from 'src/schema/pricing-setting.schema';

@Controller('service/pricing')
export class PricingController {
  constructor(private readonly pricingService: PricingService) {}

  @Get('equipment')
  async getEquipmentsForPricing(): Promise<Equipment[]> {
    return this.pricingService.getEquipmentsForPricing();
  }

  @Get('settings')
  async getPricingSettings(): Promise<PricingSetting> {
    return this.pricingService.getPricingSettings();
  }

  @Get()
  async getPricing() {
    return {
      equipment: await this.pricingService.getEquipmentsForPricing(),
      settings: await this.pricingService.getPricingSettings()
    };
  }
}
