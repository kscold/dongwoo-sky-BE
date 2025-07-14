import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  NotFoundException,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CustomerReviewService } from '../../common/service/customer-review.service';
import { CreateCustomerReviewDto } from './dto/create-customer-review.dto';
import { UpdateCustomerReviewDto } from './dto/update-customer-review.dto';
import { AuthGuard } from '@nestjs/passport';
import { PaginationUtil } from '../../common/utils/pagination.util';

@Controller('admin/customer-review')
@UseGuards(AuthGuard('jwt'))
export class CustomerReviewController {
  constructor(private readonly customerReviewService: CustomerReviewService) {}

  @Post()
  create(@Body() createCustomerReviewDto: CreateCustomerReviewDto) {
    return this.customerReviewService.createReview(createCustomerReviewDto);
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const { page: pageNumber, limit: limitNumber } = PaginationUtil.validatePaginationParams(page, limit);
    const result = await this.customerReviewService.findAllForAdmin(pageNumber, limitNumber);
    return PaginationUtil.toLegacyFormat(result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.customerReviewService.findOneForAdmin(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerReviewDto: UpdateCustomerReviewDto) {
    return this.customerReviewService.updateReview(id, updateCustomerReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerReviewService.removeReview(id);
  }

  @Patch(':id/toggle')
  toggleActive(@Param('id') id: string) {
    return this.customerReviewService.toggleActive(id);
  }

  @Post('upload-images')
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    return this.customerReviewService.uploadImages(files);
  }
}