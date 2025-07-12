import { Controller, Get } from '@nestjs/common';

import { HomeService } from './home.service';

@Controller('service/home')
export class HomeController {
  constructor(private readonly homeService: HomeService) { }

  @Get()
  async getMainPageData() {
    return this.homeService.getHomePageData();
  }
}
