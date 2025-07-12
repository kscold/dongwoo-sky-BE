import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Equipment, EquipmentDocument } from '../../schema/equipment.schema';
import { PricingSetting, PricingSettingDocument } from '../../schema/pricing-setting.schema';

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

      // 기본 설정이 없으면 생성
      if (!pricingSetting) {
        pricingSetting = await this.pricingSettingModel.create({
          mainTitle: '건설장비 대여 서비스',
          mainSubtitle: '전문적이고 안전한 건설장비 대여 서비스',
          discountBannerTitle: '온라인 예약 할인',
          discountBannerSubtitle: '온라인으로 예약하시면 최대 15% 할인 혜택을 받으실 수 있습니다',
          discountPercentage: 15,
          equipmentSectionTitle: '장비 선택',
          equipmentSectionDescription: '필요한 건설장비를 선택해주세요',
          timeSectionTitle: '이용 기간',
          timeSectionDescription: '장비 이용 기간을 설정해주세요',
          priceCardTitle: '예상 이용료',
          onlinePriceLabel: '온라인 예약가',
          contactPriceLabel: '전화 문의가',
          savingsLabel: '절약 금액',
          priceNotes: [
            '표시된 가격은 기본 이용료이며, 실제 가격은 달라질 수 있습니다.',
            '운송비, 연료비는 별도입니다.',
            '장기 대여 시 추가 할인이 가능합니다.'
          ],
          infoNotes: [
            '전문 기사 파견 서비스 제공',
            '안전장비 무료 제공',
            '24시간 응급출동 서비스'
          ],
          ctaButtonText: '지금 예약하기',
          ctaSubtext: '전문 상담사가 친절하게 도와드립니다',
          detailCardTitle: '장비 상세 정보',
          phoneNumber: '1588-0000',
          // 추가 UI 라벨 기본값
          timeSelectionLabel: '선택한 작업 시간',
          hourUnit: '시간',
          baseHoursLabel: '기본',
          additionalHoursLabel: '추가',
          hourlyRateLabel: '시간당',
          specificationsLabel: '주요 사양',
          scrollLeftAriaLabel: '왼쪽으로 스크롤',
          scrollRightAriaLabel: '오른쪽으로 스크롤',
          isActive: true,
        });
      }

      return pricingSetting;
    } catch (error) {
      throw new InternalServerErrorException(
        '가격 설정을 가져오는 중 오류가 발생했습니다.',
      );
    }
  }
}

