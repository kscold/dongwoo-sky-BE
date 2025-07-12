import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ServiceGuideService } from './service-guide.service';
import { ApiResponseInterceptor } from 'src/common/interceptor/api-response.interceptor';

@Controller('service/service-guide')
@UseInterceptors(ApiResponseInterceptor)
export class ServiceGuideController {
  constructor(private readonly serviceGuideService: ServiceGuideService) { }

  @Get()
  async getServiceGuidePage() {
    return this.serviceGuideService.getServiceGuidePageData();
  }
}
