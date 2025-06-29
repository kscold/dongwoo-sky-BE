import { Equipment, EquipmentDocument } from '../../schema/equipment.schema';
import { PricingEquipmentResponseDto } from './dto/pricing-equipment-response.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  VehicleType,
  VehicleTypeDocument,
} from '../../schema/vehicle-type.schema';

@Injectable()
export class PricingService {
  constructor(
    @InjectModel(VehicleType.name)
    private vehicleTypeModel: Model<VehicleTypeDocument>,
    @InjectModel(Equipment.name)
    private equipmentModel: Model<EquipmentDocument>,
  ) {}
  // 이용요금 페이지에서 필요한 장비 정보 반환
  async getEquipments(): Promise<PricingEquipmentResponseDto[]> {
    const equipments = await this.equipmentModel
      .find({ isActive: true, showInPricing: true })
      .sort({ sortOrder: 1 })
      .exec();
    return equipments.map((e) => ({
      id: (e as any)._id?.toString?.() ?? '',
      name: e.name,
      description: e.description,
      imageUrl: e.imageUrl,
      isActive: e.isActive,
      sortOrder: e.sortOrder,
      specifications: e.specifications,
      priceRange: e.priceRange,
      tonnage: e.tonnage,
      maxHeight: e.maxHeight,
      maxWeight: e.maxWeight,
      iconUrl: e.iconUrl,
      priceRanges: e.priceRanges,
      showInService: e.showInService,
      showInPricing: e.showInPricing,
      createdAt: (e as any).createdAt,
      updatedAt: (e as any).updatedAt,
    }));
  }
}
