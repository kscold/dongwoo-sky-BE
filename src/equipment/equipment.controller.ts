import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { S3Service } from '../aws/s3.service';
import { AdminAuthGuard } from 'src/admin/guards/admin-auth.guard';

@Controller('equipment')
export class EquipmentController {
  constructor(
    private readonly equipmentService: EquipmentService,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  findAll() {
    return this.equipmentService.findAll();
  }

  @Get('admin')
  @UseGuards(AdminAuthGuard)
  findAllAdmin() {
    return this.equipmentService.findAllAdmin();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.equipmentService.findOne(id);
  }

  @Post()
  @UseGuards(AdminAuthGuard)
  create(@Body() createEquipmentDto: CreateEquipmentDto) {
    return this.equipmentService.create(createEquipmentDto);
  }

  @Post('upload-image')
  @UseGuards(AdminAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('파일이 업로드되지 않았습니다.');
    }

    const folder = 'equipment';
    const result = await this.s3Service.uploadFile(file, folder);
    return { imageUrl: result.url };
  }

  @Patch(':id')
  @UseGuards(AdminAuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateEquipmentDto: UpdateEquipmentDto,
  ) {
    return this.equipmentService.update(id, updateEquipmentDto);
  }

  @Put('sort-order')
  @UseGuards(AdminAuthGuard)
  updateSortOrder(@Body() { equipmentIds }: { equipmentIds: string[] }) {
    return this.equipmentService.updateSortOrder(equipmentIds);
  }

  @Delete(':id')
  @UseGuards(AdminAuthGuard)
  remove(@Param('id') id: string) {
    return this.equipmentService.remove(id);
  }
}
