import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { NoticesService } from './notices.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Controller('notices')
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createNoticeDto: CreateNoticeDto) {
    return this.noticesService.create(createNoticeDto);
  }

  @Get()
  findAll() {
    return this.noticesService.findAll();
  }
  
  @Get('published')
  findPublished() {
    return this.noticesService.findPublished();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.noticesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoticeDto: UpdateNoticeDto) {
    return this.noticesService.update(id, updateNoticeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.noticesService.remove(id);
  }
}
