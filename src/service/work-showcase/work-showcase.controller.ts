import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { WorkShowcaseService } from './work-showcase.service';

@Controller('service/work-showcase')
export class WorkShowcaseController {
  constructor(private readonly workShowcaseService: WorkShowcaseService) {}

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.workShowcaseService.findAll(
      parseInt(page, 10),
      parseInt(limit, 10),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const showcase = await this.workShowcaseService.findOne(id);
    if (!showcase) {
      throw new NotFoundException(`Work showcase with ID "${id}" not found`);
    }
    return showcase;
  }
}
