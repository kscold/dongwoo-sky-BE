import { Controller, Get, Post, Param, Query, NotFoundException } from '@nestjs/common';

import { CustomerReviewService } from '../../common/service/customer-review.service';
import { PaginationUtil } from '../../common/utils/pagination.util';

@Controller('service/customer-review')
export class CustomerReviewController {
  constructor(private readonly customerReviewService: CustomerReviewService) { }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const { page: pageNumber, limit: limitNumber } = PaginationUtil.validatePaginationParams(page, limit);
    const result = await this.customerReviewService.findAllForService(pageNumber, limitNumber);
    return PaginationUtil.toLegacyFormat(result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.customerReviewService.findOneForService(id);
  }

  @Post(':id/helpful')
  async markHelpful(@Param('id') id: string) {
    return this.customerReviewService.incrementHelpfulCount(id);
  }
}
