import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Equipment, EquipmentDocument } from '../../schema/equipment.schema';
import { AdminEquipmentCreateDto } from './dto/request/admin-equipment-create.dto';
import { AdminEquipmentUpdateDto } from './dto/request/admin-equipment-update.dto';
import { AdminEquipmentResponseDto } from './dto/response/admin-equipment.response.dto';
import { FileService } from '../../common/file/file.service';

@Injectable()
export class EquipmentService {
  constructor(
    @InjectModel(Equipment.name)
    private equipmentModel: Model<EquipmentDocument>,
    private readonly fileService: FileService,
  ) {}

  private toResponseDto(equipment: Equipment): AdminEquipmentResponseDto {
    return {
      id: (equipment as any)._id?.toString?.() ?? '',
      name: equipment.name,
      description: equipment.description,
      imageUrl: equipment.imageUrl,
      isActive: equipment.isActive,
      sortOrder: equipment.sortOrder,
      specifications: equipment.specifications,
      priceRange: equipment.priceRange,
      tonnage: equipment.tonnage,
      maxHeight: equipment.maxHeight,
      maxWeight: equipment.maxWeight,
      iconUrl: equipment.iconUrl,
      priceRanges: equipment.priceRanges,
      showInService: equipment.showInService,
      showInPricing: equipment.showInPricing,
      createdAt: (equipment as any).createdAt,
      updatedAt: (equipment as any).updatedAt,
    };
  }

  async create(
    createEquipmentDto: AdminEquipmentCreateDto,
  ): Promise<{ data: AdminEquipmentResponseDto }> {
    try {
      const equipment = new this.equipmentModel(createEquipmentDto);
      const saved = await equipment.save();
      return { data: this.toResponseDto(saved) };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findAll(): Promise<{ data: AdminEquipmentResponseDto[] }> {
    try {
      const result = await this.equipmentModel
        .find({ isActive: true })
        .sort({ sortOrder: 1, createdAt: 1 })
        .exec();
      return { data: result.map(this.toResponseDto) };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findAllAdmin(): Promise<{ data: AdminEquipmentResponseDto[] }> {
    try {
      const result = await this.equipmentModel
        .find()
        .sort({ sortOrder: 1, createdAt: 1 })
        .exec();
      return { data: result.map(this.toResponseDto) };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async findOne(id: string): Promise<{ data: AdminEquipmentResponseDto }> {
    try {
      const equipment = await this.equipmentModel.findById(id).exec();
      if (!equipment) {
        throw new NotFoundException('장비를 찾을 수 없습니다.');
      }
      return { data: this.toResponseDto(equipment) };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async update(
    id: string,
    updateEquipmentDto: AdminEquipmentUpdateDto,
  ): Promise<{ data: AdminEquipmentResponseDto }> {
    try {
      const equipment = await this.equipmentModel
        .findByIdAndUpdate(id, updateEquipmentDto, { new: true })
        .exec();
      if (!equipment) {
        throw new NotFoundException('장비를 찾을 수 없습니다.');
      }
      return { data: this.toResponseDto(equipment) };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async remove(id: string): Promise<{ success: boolean }> {
    try {
      const result = await this.equipmentModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException('장비를 찾을 수 없습니다.');
      }
      return { success: true };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async updateSortOrder(equipmentIds: string[]): Promise<{ success: boolean }> {
    try {
      const updatePromises = equipmentIds.map((id, index) =>
        this.equipmentModel.findByIdAndUpdate(id, { sortOrder: index }).exec(),
      );
      await Promise.all(updatePromises);
      return { success: true };
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<{ imageUrl: string }> {
    if (!file) {
      throw new BadRequestException('파일이 업로드되지 않았습니다.');
    }
    const folder = 'equipment';
    const result = await this.fileService.uploadFile(file, folder, {
      compressImage: true,
      imageOptions: { quality: 85, width: 1920 },
      allowedExtensions: [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'webp',
        'heic',
        'heif',
        'avif',
      ],
      maxSize: 15 * 1024 * 1024,
    });
    return { imageUrl: result.url };
  }
}
