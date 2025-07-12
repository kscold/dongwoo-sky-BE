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
import { CustomerReviewService } from './customer-review.service';
import { CreateCustomerReviewDto } from './dto/create-customer-review.dto';
import { UpdateCustomerReviewDto } from './dto/update-customer-review.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin/customer-review')
@UseGuards(AuthGuard('jwt'))
export class CustomerReviewController {
  constructor(private readonly customerReviewService: CustomerReviewService) {}

  @Post()
  create(@Body() createCustomerReviewDto: CreateCustomerReviewDto) {
    return this.customerReviewService.create(createCustomerReviewDto);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    
    return this.customerReviewService.findAll(pageNumber, limitNumber);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const review = await this.customerReviewService.findOne(id);
    if (!review) {
      throw new NotFoundException(`Customer review with ID "${id}" not found`);
    }
    return review;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerReviewDto: UpdateCustomerReviewDto) {
    return this.customerReviewService.update(id, updateCustomerReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerReviewService.remove(id);
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