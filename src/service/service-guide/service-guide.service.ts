import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Equipment, EquipmentDocument } from 'src/schema/equipment.schema';
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

  private async findOrCreateServiceGuide(): Promise<ServiceGuideDocument> {
    this.logger.log(
      '[findOrCreateServiceGuide] 서비스 가이드 조회 또는 생성 시작',
    );
    try {
      let serviceGuide = await this.serviceGuideModel
        .findOne({ key: SERVICE_GUIDE_KEY })
        .exec();

      if (!serviceGuide) {
        const defaultProfile = {
          name: '현동우 대표',
          role: '어울림 스카이 대표 / 20년 경력 종합 장비 전문가',
          introduction:
            '고객 여러분의 안전과 만족을 최우선으로 생각하는 어울림 스카이 대표 현동우입니다. 20년간 다양한 현장에서 쌓아온 경험과 노하우를 바탕으로, 고객님의 어떤 작업 요구에도 최적의 솔루션을 제공해왔습니다. 스카이차, 크레인, 굴착기 등 모든 장비를 직접 운용하고 정비하며, 항상 최상의 장비 상태를 유지하고 있습니다. 안전은 그 무엇과도 바꿀 수 없는 가치입니다. 모든 작업은 철저한 안전 점검과 규정 준수 하에 진행되며, 고객님의 소중한 자산과 현장의 안전을 확보하기 위해 최선을 다합니다. 궁금하신 점이나 필요한 작업이 있으시면 언제든지 편하게 문의하십시오. 신뢰와 기술력으로 보답하겠습니다.',
          imageUrl: '',
          career: [
            '2003년 ~ 현재: 어울림 스카이 중장비 운영 대표',
            '대형 건설 현장 고소 작업 총괄 다수 (아파트, 상가, 공장 등)',
            '특수 교량 점검 및 유지보수 작업 참여',
            '영화 및 드라마 촬영 현장 특수 장비 지원',
            '긴급 재해 복구 현장 장비 지원',
            '연 1,000회 이상 다양한 현장 출동 및 작업 수행',
          ],
          skills: [
            '스카이차 전 기종 운용 및 정비 (최대 75m)',
            '카고 크레인 (5톤 ~ 25톤) 운용 및 정비',
            '미니 굴착기 (0.8톤 ~ 3.5톤) 운용',
            '고소 작업 안전 관리 자격 보유',
            '중장비 정비 기능사',
            '현장 위험성 평가 및 안전 계획 수립',
            '고객 맞춤형 작업 컨설팅',
          ],
        };

        const defaultProcessSteps = [
          {
            icon: 'Phone',
            title: '고객 배차신청 접수',
            description: '전화 및 온라인으로 상담 후 장비차량 배차신청',
          },
          {
            icon: 'ClipboardDocumentCheck',
            title: '차량조회/배차확정',
            description: '인접차량 실시간 검색 후 제일 적합한 차량으로 배정',
          },
          {
            icon: 'Truck',
            title: '현장 서비스',
            description: '최대한 고객 요구사항에 맞춰 안전한 현장 서비스 시행',
          },
          {
            icon: 'CreditCard',
            title: '결제',
            description:
              '저희 사다리차 협동조합에서는 반드시 당일 수금을 원칙으로 합니다.',
          },
        ];

        const defaultScopeOfWork = [
          { icon: 'BuildingOffice', text: '건물 외벽 공사 및 보수' },
          { icon: 'PaintBrush', text: '간판 및 현수막 설치/철거' },
          { icon: 'Sparkles', text: '유리 및 외벽 청소' },
          { icon: 'ArchiveBox', text: '건설 자재 운반 및 상하차' },
          { icon: 'Sun', text: '조경 작업 및 수목 관리' },
          { icon: 'PlusCircle', text: '기타 중량물 작업 및 고소 작업 일체' },
        ];

        serviceGuide = new this.serviceGuideModel({
          key: SERVICE_GUIDE_KEY,
          heroTitle: '어울림 스카이 서비스 안내',
          heroSubtitle:
            '고객님의 안전과 만족을 최우선으로 생각하는 어울림 스카이입니다. 다양한 최신 장비와 숙련된 전문 작업팀이 안전하고 신속한 서비스를 제공합니다.',
          equipmentSectionTitle: '보유 장비 소개',
          scopeOfWorkSectionTitle: '작업 가능 범위',
          profileSectionTitle: '대표 프로필',
          processSectionTitle: '서비스 계약 프로세스',
          profile: defaultProfile,
          processSteps: defaultProcessSteps,
          scopeOfWork: defaultScopeOfWork,
        });
        await serviceGuide.save();
        this.logger.log(
          '[findOrCreateServiceGuide] 기본 서비스 가이드 생성 완료',
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
      throw new InternalServerErrorException(e.message);
    }
  }

  async getServiceGuidePageData(): Promise<{
    serviceGuide: ServiceGuideDocument;
    equipments: EquipmentDocument[];
  }> {
    this.logger.log(
      '[getServiceGuidePageData] 서비스 가이드 페이지 데이터 조회 시작',
    );
    try {
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
      throw new InternalServerErrorException(e.message);
    }
  }
}
