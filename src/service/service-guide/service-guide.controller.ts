import { Controller, Get } from '@nestjs/common';
import { ServiceGuideService } from './service-guide.service';
import { Equipment } from 'src/schema/equipment.schema';

@Controller('service/service-guide')
export class ServiceGuideController {
  constructor(private readonly serviceGuideService: ServiceGuideService) {}

  @Get()
  async getEquipmentsForServiceGuide(): Promise<Equipment[]> {
    return this.serviceGuideService.getEquipmentsForServiceGuide();
  }
}
