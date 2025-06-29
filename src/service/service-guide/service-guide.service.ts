import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Equipment, EquipmentDocument } from '../../schema/equipment.schema';

@Injectable()
export class ServiceGuideService {
  constructor(
    @InjectModel(Equipment.name)
    private equipmentModel: Model<EquipmentDocument>,
  ) {}

  async getEquipmentsForServiceGuide(): Promise<Equipment[]> {
    try {
      return await this.equipmentModel
        .find({ isActive: true, showInService: true })
        .sort({ sortOrder: 1 })
        .limit(10)
        .exec();
    } catch (error) {
      // TODO: Add logger
      throw new InternalServerErrorException(
        '서비스 소개 정보를 위한 장비 목록을 가져오는 중 오류가 발생했습니다.',
      );
    }
  }
}
