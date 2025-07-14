import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Equipment, EquipmentDocument } from '../../schema/equipment.schema';
import { AdminEquipmentCreateRequestDto } from './dto/request/admin-equipment-create-request.dto';
import { AdminEquipmentUpdateRequestDto } from './dto/request/admin-equipment-update-request.dto';
import { AdminEquipmentResponseDto } from './dto/response/admin-equipment-response.dto';

import { FileService } from '../../common/file/file.service';

@Injectable()
export class EquipmentService {
  private readonly logger = new Logger(EquipmentService.name);

  constructor(
    @InjectModel(Equipment.name)
    private equipmentModel: Model<EquipmentDocument>,
    private readonly fileService: FileService,
  ) { }

  private toResponseDto(equipment: Equipment): AdminEquipmentResponseDto {
    return {
      id: (equipment as any)._id?.toString?.() ?? '',
      name: equipment.name,
      description: equipment.description,
      imageUrl: equipment.imageUrl,
      isPublished: equipment.isPublished,
      sortOrder: equipment.sortOrder,
      specifications: equipment.specifications,
      capabilities: equipment.capabilities,
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
    createEquipmentDto: AdminEquipmentCreateRequestDto,
  ): Promise<AdminEquipmentResponseDto> {
    this.logger.log(`[create] 장비 생성 시작: ${createEquipmentDto.name}`);
    try {
      const equipment = new this.equipmentModel(createEquipmentDto);
      const saved = await equipment.save();
      this.logger.log(`[create] 장비 생성 성공: ${createEquipmentDto.name}`);
      return this.toResponseDto(saved);
    } catch (e) {
      this.logger.error(`[create] 장비 생성 실패: ${createEquipmentDto.name}`, e.stack);
      throw new BadRequestException(e.message);
    }
  }

  async findAll(): Promise<AdminEquipmentResponseDto[]> {
    this.logger.log('[findAll] 공개 장비 목록 조회 시작');
    try {
      const result = await this.equipmentModel
        .find({ isPublished: true })
        .sort({ sortOrder: 1, createdAt: 1 })
        .exec();
      this.logger.log(`[findAll] 공개 장비 목록 조회 성공: ${result.length}개`);
      return result.map(this.toResponseDto);
    } catch (e) {
      this.logger.error('[findAll] 공개 장비 목록 조회 실패', e.stack);
      throw new BadRequestException(e.message);
    }
  }

  async findAllAdmin(): Promise<AdminEquipmentResponseDto[]> {
    this.logger.log('[findAllAdmin] 관리자 장비 목록 조회 시작');
    try {
      const result = await this.equipmentModel
        .find()
        .sort({ sortOrder: 1, createdAt: 1 })
        .exec();
      this.logger.log(`[findAllAdmin] 관리자 장비 목록 조회 성공: ${result.length}개`);
      return result.map(this.toResponseDto);
    } catch (e) {
      this.logger.error('[findAllAdmin] 관리자 장비 목록 조회 실패', e.stack);
      throw new BadRequestException(e.message);
    }
  }

  async findOne(id: string): Promise<AdminEquipmentResponseDto> {
    this.logger.log(`[findOne] 장비 상세 조회 시작: ${id}`);
    try {
      const equipment = await this.equipmentModel.findById(id).exec();
      if (!equipment) {
        this.logger.warn(`[findOne] 장비를 찾을 수 없음: ${id}`);
        throw new NotFoundException('장비를 찾을 수 없습니다.');
      }
      this.logger.log(`[findOne] 장비 상세 조회 성공: ${id}`);
      return this.toResponseDto(equipment);
    } catch (e) {
      this.logger.error(`[findOne] 장비 상세 조회 실패: ${id}`, e.stack);
      throw e instanceof NotFoundException ? e : new BadRequestException(e.message);
    }
  }

  async update(
    id: string,
    updateEquipmentDto: AdminEquipmentUpdateRequestDto,
  ): Promise<AdminEquipmentResponseDto> {
    this.logger.log(`[update] 장비 수정 시작: ${id}`);
    try {
      const equipment = await this.equipmentModel
        .findByIdAndUpdate(id, updateEquipmentDto, { new: true })
        .exec();
      if (!equipment) {
        this.logger.warn(`[update] 수정할 장비를 찾을 수 없음: ${id}`);
        throw new NotFoundException('장비를 찾을 수 없습니다.');
      }
      this.logger.log(`[update] 장비 수정 성공: ${id}`);
      return this.toResponseDto(equipment);
    } catch (e) {
      this.logger.error(`[update] 장비 수정 실패: ${id}`, e.stack);
      throw e instanceof NotFoundException ? e : new BadRequestException(e.message);
    }
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`[remove] 장비 삭제 시작: ${id}`);
    try {
      const result = await this.equipmentModel.findByIdAndDelete(id).exec();
      if (!result) {
        this.logger.warn(`[remove] 삭제할 장비를 찾을 수 없음: ${id}`);
        throw new NotFoundException('장비를 찾을 수 없습니다.');
      }
      this.logger.log(`[remove] 장비 삭제 성공: ${id}`);
    } catch (e) {
      this.logger.error(`[remove] 장비 삭제 실패: ${id}`, e.stack);
      throw e instanceof NotFoundException ? e : new BadRequestException(e.message);
    }
  }

  async updateSortOrder(equipmentIds: string[]): Promise<void> {
    this.logger.log(`[updateSortOrder] 장비 정렬 순서 변경 시작: ${equipmentIds.length}개`);
    try {
      const updatePromises = equipmentIds.map((id, index) =>
        this.equipmentModel.findByIdAndUpdate(id, { sortOrder: index }).exec(),
      );
      await Promise.all(updatePromises);
      this.logger.log(`[updateSortOrder] 장비 정렬 순서 변경 성공: ${equipmentIds.length}개`);
    } catch (e) {
      this.logger.error(`[updateSortOrder] 장비 정렬 순서 변경 실패`, e.stack);
      throw new BadRequestException(e.message);
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<{ imageUrl: string }> {
    this.logger.log(`[uploadImage] 장비 이미지 업로드 시작: ${file?.originalname}`);
    try {
      if (!file) {
        this.logger.warn('[uploadImage] 업로드할 파일이 없음');
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
      this.logger.log(`[uploadImage] 장비 이미지 업로드 성공: ${file.originalname}`);
      return { imageUrl: result.url };
    } catch (e) {
      this.logger.error(`[uploadImage] 장비 이미지 업로드 실패: ${file?.originalname}`, e.stack);
      throw e instanceof BadRequestException ? e : new BadRequestException(e.message);
    }
  }
}
