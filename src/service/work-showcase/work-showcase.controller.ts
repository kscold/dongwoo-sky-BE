import {
  Controller,
  Get,
  Post,
  Param,
  NotFoundException,
} from '@nestjs/common';

import { WorkShowcaseService } from './work-showcase.service';

@Controller('service/work-showcase')
export class WorkShowcaseController {
  constructor(private readonly workShowcaseService: WorkShowcaseService) { }

  @Get()
  async findAll() {
    return this.workShowcaseService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const showcase = await this.workShowcaseService.findOne(id);
    if (!showcase) {
      throw new NotFoundException(`Work showcase with ID "${id}" not found`);
    }
    return showcase;
  }

  @Post(':id/like')
  async like(@Param('id') id: string) {
    return this.workShowcaseService.incrementLikeCount(id);
  }
}
