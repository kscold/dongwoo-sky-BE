import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Equipment, EquipmentDocument } from '../../schema/equipment.schema';
import {
    ServiceGuide,
    ServiceGuideDocument,
} from '../../schema/service-guide.schema';

const SERVICE_GUIDE_KEY = 'main_service_guide';

@Injectable()
export class ServiceGuideService {
    private readonly logger = new Logger(ServiceGuideService.name);

    constructor(
        @InjectModel(ServiceGuide.name)
        private readonly serviceGuideModel: Model<ServiceGuideDocument>,
        @InjectModel(Equipment.name)
        private readonly equipmentModel: Model<EquipmentDocument>,
    ) {}

    async getServiceGuidePageData(): Promise<{
        serviceGuide: ServiceGuideDocument;
        equipments: EquipmentDocument[];
    }> {
        try {
            this.logger.log(
                '[getServiceGuidePageData] 서비스 가이드 페이지 데이터 조회 시작',
            );
            const [serviceGuide, equipments] = await Promise.all([
                this.findOrCreateServiceGuide(),
                this.equipmentModel
                    .find({ showInService: true, isActive: true })
                    .sort({ sortOrder: 1 })
                    .exec(),
            ]);

            this.logger.log(
                '[getServiceGuidePageData] 서비스 가이드 페이지 데이터 조회 성공',
            );
            return { serviceGuide, equipments };
        } catch (e) {
            this.logger.error(
                '[getServiceGuidePageData] 서비스 가이드 페이지 데이터 조회 실패',
                e.stack,
            );
            throw new BadRequestException(
                `서비스 가이드 페이지 데이터 조회 실패: ${e.message}`,
            );
        }
    }

    private async findOrCreateServiceGuide(): Promise<ServiceGuideDocument> {
        this.logger.log(
            '[findOrCreateServiceGuide] 서비스 가이드 조회 또는 생성 시작',
        );
        try {
            let serviceGuide = await this.serviceGuideModel
                .findOne({ key: SERVICE_GUIDE_KEY })
                .exec();

            if (!serviceGuide) {
                this.logger.log(
                    '[findOrCreateServiceGuide] 기본 서비스 가이드 생성 완료',
                );
                throw new BadRequestException(
                    '서비스 가이드 데이터가 없습니다.',
                );
            }

            this.logger.log(
                '[findOrCreateServiceGuide] 서비스 가이드 조회 또는 생성 성공',
            );
            return serviceGuide;
        } catch (e) {
            this.logger.error(
                '[findOrCreateServiceGuide] 서비스 가이드 조회 또는 생성 실패',
                e.stack,
            );
            throw new BadRequestException(
                `서비스 가이드 조회 또는 생성 실패: ${e.message}`,
            );
        }
    }
}
