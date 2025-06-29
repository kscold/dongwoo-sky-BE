import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';

import { CustomerReviewService } from './customer-review.service';

@Controller('service/customer-review')
export class CustomerReviewController {
  constructor(private readonly customerReviewService: CustomerReviewService) {}

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.customerReviewService.findAll(parseInt(page, 10), parseInt(limit, 10));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const review = await this.customerReviewService.findOne(id);
    if (!review) {
      throw new NotFoundException(`Customer review with ID "${id}" not found`);
    }
    return review;
  }
}
