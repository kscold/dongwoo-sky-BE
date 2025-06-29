import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Equipment, EquipmentDocument } from '../../schema/equipment.schema';
import { ServiceGuideEquipmentResponseDto } from './dto/service-guide-equipment-response.dto';

@Injectable()
export class ServiceGuideService {
  constructor(
    @InjectModel(Equipment.name)
    private equipmentModel: Model<EquipmentDocument>,
  ) {}

  async getEquipments(): Promise<ServiceGuideEquipmentResponseDto[]> {
    const equipments = await this.equipmentModel
      .find({ isActive: true })
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
