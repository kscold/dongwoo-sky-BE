import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PricingSetting, PricingSettingDocument } from '../../schema/pricing-setting.schema';
import { AdminPricingSettingUpdateRequestDto } from './dto/request/admin-pricing-setting-update-request.dto';
import { AdminPricingSettingResponseDto } from './dto/response/admin-pricing-setting-response.dto';

@Injectable()
export class AdminPricingSettingService {
    constructor(
        @InjectModel(PricingSetting.name)
        private pricingSettingModel: Model<PricingSettingDocument>,
    ) { }

    async getPricingSettings(): Promise<AdminPricingSettingResponseDto> {
        let pricingSetting: PricingSettingDocument | null = await this.pricingSettingModel.findOne({ isActive: true }).exec();

        if (!pricingSetting) {
            pricingSetting = await this.createDefaultPricingSetting();
        }

        return this.mapToResponseDto(pricingSetting);
    }

    async updatePricingSettings(updateDto: AdminPricingSettingUpdateRequestDto): Promise<AdminPricingSettingResponseDto> {
        const { id, ...updateData } = updateDto;

        let pricingSetting: PricingSettingDocument | null;

        if (id) {
            pricingSetting = await this.pricingSettingModel.findByIdAndUpdate(
                id,
                updateData,
                { new: true }
            ).exec();

            if (!pricingSetting) {
                pricingSetting = await this.createDefaultPricingSetting();
            }
        } else {
            pricingSetting = await this.createDefaultPricingSetting();
        }

        return this.mapToResponseDto(pricingSetting);
    }

    private async createDefaultPricingSetting(): Promise<PricingSettingDocument> {
        const defaultSetting = {
            mainTitle: '원하는 중장비를 온라인에서',
            mainSubtitle: '투명한 가격으로 바로 견적을 받아보세요',
            discountBannerTitle: '지금 온라인 견적시',
            discountBannerSubtitle: '최대 15% 할인!',
            discountPercentage: 15,
            equipmentSectionTitle: '원하시는 중장비를 선택해주세요',
            equipmentSectionDescription: '다양한 중장비 중에서 필요한 장비를 선택하세요',
            timeSectionTitle: '사용 시간을 선택해주세요',
            timeSectionDescription: '원하시는 사용 시간을 설정하세요',
            priceCardTitle: '예상 견적',
            onlinePriceLabel: '온라인 견적 가격',
            contactPriceLabel: '직접 문의 시 가격',
            savingsLabel: '절약 금액',
            priceNotes: [
                '* 최종 가격은 현장 상황에 따라 변동될 수 있습니다',
                '* 운송비는 별도 계산됩니다',
                '* 연료비 및 기사비 포함 가격입니다'
            ],
            infoNotes: [
                'VAT 별도, 현장 상황에 따라 변동될 수 있습니다',
                '직접 문의 시 현장 조건을 고려한 정확한 견적을 제공합니다',
                '장기 이용 시 추가 할인 혜택이 있습니다'
            ],
            ctaButtonText: '지금 전화하기',
            ctaSubtext: '전문 상담사가 친절하게 안내해드립니다',
            detailCardTitle: '상세 견적을 원하시나요?',
            phoneNumber: '1588-0000',
            isActive: true
        };

        return await this.pricingSettingModel.create(defaultSetting);
    }

    private mapToResponseDto(pricingSetting: PricingSettingDocument): AdminPricingSettingResponseDto {
        return {
            _id: pricingSetting._id.toString(),
            mainTitle: pricingSetting.mainTitle,
            mainSubtitle: pricingSetting.mainSubtitle,
            discountBannerTitle: pricingSetting.discountBannerTitle,
            discountBannerSubtitle: pricingSetting.discountBannerSubtitle,
            discountPercentage: pricingSetting.discountPercentage,
            equipmentSectionTitle: pricingSetting.equipmentSectionTitle,
            equipmentSectionDescription: pricingSetting.equipmentSectionDescription,
            timeSectionTitle: pricingSetting.timeSectionTitle,
            timeSectionDescription: pricingSetting.timeSectionDescription,
            priceCardTitle: pricingSetting.priceCardTitle,
            onlinePriceLabel: pricingSetting.onlinePriceLabel,
            contactPriceLabel: pricingSetting.contactPriceLabel,
            savingsLabel: pricingSetting.savingsLabel,
            priceNotes: pricingSetting.priceNotes,
            infoNotes: pricingSetting.infoNotes,
            ctaButtonText: pricingSetting.ctaButtonText,
            ctaSubtext: pricingSetting.ctaSubtext,
            detailCardTitle: pricingSetting.detailCardTitle,
            phoneNumber: pricingSetting.phoneNumber,
            isActive: pricingSetting.isActive,
            createdAt: pricingSetting.createdAt,
            updatedAt: pricingSetting.updatedAt,
        };
    }
} 