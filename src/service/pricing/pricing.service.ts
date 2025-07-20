import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Equipment, EquipmentDocument } from '../../schema/equipment.schema';

import {
    PricingSetting,
    PricingSettingDocument,
} from '../../schema/pricing-setting.schema';

@Injectable()
export class PricingService {
    private readonly logger = new Logger(PricingService.name);

    constructor(
        @InjectModel(Equipment.name)
        private equipmentModel: Model<EquipmentDocument>,
        @InjectModel(PricingSetting.name)
        private pricingSettingModel: Model<PricingSettingDocument>,
    ) {}

    async getEquipmentsForPricing(): Promise<Equipment[]> {
        try {
            const equipments = await this.equipmentModel
                .find({ isPublished: true, showInPricing: true })
                .sort({ sortOrder: 1 })
                .limit(50)
                .exec();

            // 장비가 없으면 목 데이터 생성
            if (!equipments || equipments.length === 0) {
                throw new BadRequestException('장비 데이터가 없습니다.');
            }

            return equipments;
        } catch (error) {
            this.logger.error(
                `[getEquipmentsForPricing] getEquipmentsForPricing error: ${error}`,
            );
            throw new BadRequestException(
                '이용요금 정보를 위한 장비 목록을 가져오는 중 오류가 발생했습니다.',
            );
        }
    }

    async getPricingSettings(): Promise<PricingSetting> {
        try {
            const pricingSetting = await this.pricingSettingModel
                .findOne({ isActive: true })
                .exec();

            if (!pricingSetting) {
                throw new BadRequestException('가격 설정 데이터가 없습니다.');
            }

            return pricingSetting;
        } catch (error) {
            this.logger.error(
                `[getPricingSettings] getPricingSettings error: ${error}`,
            );
            throw new BadRequestException(
                '가격 설정을 가져오는 중 오류가 발생했습니다.',
            );
        }
    }
}
