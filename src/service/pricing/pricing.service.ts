import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Equipment, EquipmentDocument } from '../../schema/equipment.schema';
import { PricingSetting, PricingSettingDocument } from '../../schema/pricing-setting.schema';
import { DEFAULT_PRICING_SETTINGS } from '../../common/constants/default-pricing-settings.constant';

@Injectable()
export class PricingService {
  constructor(
    @InjectModel(Equipment.name)
    private equipmentModel: Model<EquipmentDocument>,
    @InjectModel(PricingSetting.name)
    private pricingSettingModel: Model<PricingSettingDocument>,
  ) { }

  async getEquipmentsForPricing(): Promise<Equipment[]> {
    try {
      let equipments = await this.equipmentModel
        .find({ isPublished: true, showInPricing: true })
        .sort({ sortOrder: 1 })
        .limit(50)
        .exec();

      // 장비가 없으면 목 데이터 생성
      if (!equipments || equipments.length === 0) {
        await this.createMockEquipments();
        equipments = await this.equipmentModel
          .find({ isPublished: true, showInPricing: true })
          .sort({ sortOrder: 1 })
          .limit(50)
          .exec();
      }

      return equipments;
    } catch (error) {
      // TODO: Add logger
      throw new InternalServerErrorException(
        '이용요금 정보를 위한 장비 목록을 가져오는 중 오류가 발생했습니다.',
      );
    }
  }

  private async createMockEquipments(): Promise<void> {
    const mockEquipments = [
      {
        name: '25톤 크레인',
        description: '중형 건설 현장에서 사용되는 25톤급 크레인입니다. 안전하고 효율적인 작업이 가능합니다.',
        specifications: '최대 하중: 25톤\n최대 높이: 35m\n작업 반경: 25m\n엔진: 디젤 280HP',
        capabilities: ['중형 구조물 설치', '건물 내부 작업', '정밀 작업'],
        priceRange: '400,000원 ~ 600,000원/일',
        maxHeight: '35m',
        maxWeight: '25톤',
        tonnage: '25톤',
        imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop',
        isActive: true,
        isPublished: true,
        showInService: true,
        showInPricing: true,
        sortOrder: 1,
        baseHours: 4,
        minHours: 1,
        maxHours: 12,
        basePrice: 400000,
        hourlyRate: 50000,
        priceRanges: [],
        workingTimeRanges: []
      },
      {
        name: '50톤 크레인',
        description: '대형 건설 현장에서 사용되는 50톤급 크레인입니다. 높은 안전성과 정밀한 작업이 가능합니다.',
        specifications: '최대 하중: 50톤\n최대 높이: 40m\n작업 반경: 30m\n엔진: 디젤 350HP',
        capabilities: ['대형 구조물 설치', '고층 건물 작업', '중량물 운반'],
        priceRange: '600,000원 ~ 900,000원/일',
        maxHeight: '40m',
        maxWeight: '50톤',
        tonnage: '50톤',
        imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop',
        isActive: true,
        isPublished: true,
        showInService: true,
        showInPricing: true,
        sortOrder: 2,
        baseHours: 4,
        minHours: 1,
        maxHours: 12,
        basePrice: 600000,
        hourlyRate: 75000,
        priceRanges: [],
        workingTimeRanges: []
      },
      {
        name: '15톤 덤프트럭',
        description: '건설 현장에서 토사 운반에 사용되는 15톤급 덤프트럭입니다.',
        specifications: '적재량: 15톤\n차체 길이: 8.5m\n차체 폭: 2.5m\n엔진: 디젤 380HP',
        capabilities: ['토사 운반', '자재 운송', '폐기물 처리'],
        priceRange: '200,000원 ~ 350,000원/일',
        maxHeight: '3.5m',
        maxWeight: '15톤',
        tonnage: '15톤',
        imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop',
        isActive: true,
        isPublished: true,
        showInService: true,
        showInPricing: true,
        sortOrder: 3,
        baseHours: 4,
        minHours: 1,
        maxHours: 12,
        basePrice: 200000,
        hourlyRate: 25000,
        priceRanges: [],
        workingTimeRanges: []
      }
    ];

    try {
      await this.equipmentModel.insertMany(mockEquipments);
    } catch (error) {
      // 이미 존재하는 경우 무시
      console.log('Mock equipments already exist or insertion failed:', error.message);
    }
  }

  async getPricingSettings(): Promise<PricingSetting> {
    try {
      let pricingSetting = await this.pricingSettingModel
        .findOne({ isActive: true })
        .exec();

      if (!pricingSetting) {
        pricingSetting = await this.pricingSettingModel.create(DEFAULT_PRICING_SETTINGS);
      }

      return pricingSetting;
    } catch (error) {
      throw new InternalServerErrorException(
        '가격 설정을 가져오는 중 오류가 발생했습니다.',
      );
    }
  }
}

