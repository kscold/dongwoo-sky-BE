import { Injectable, BadRequestException } from '@nestjs/common';
import { AdminProfileUpdateDto } from './dto/request/admin-profile-update.dto';
import { AdminProfileResponseDto } from './dto/response/admin-profile.response.dto';

// 실제 운영에서는 DB에 저장해야 하지만, 예시로 메모리 변수 사용
let profile: AdminProfileResponseDto = {
  name: '현동우 대표 (사장)',
  title: '어울림 스카이 대표 / 20년 경력 종합 장비 전문가',
  introduction: `고객 여러분의 안전과 만족을 최우선으로 생각하는 어울림 스카이 대표 현동우입니다.\n20년간 다양한 현장에서 쌓아온 경험과 노하우를 바탕으로, 고객님의 어떤 작업 요구에도 최적의 솔루션을 제공해왔습니다.\n스카이차, 크레인, 굴착기 등 모든 장비를 직접 운용하고 정비하며, 항상 최상의 장비 상태를 유지하고 있습니다.\n\n안전은 그 무엇과도 바꿀 수 없는 가치입니다. 모든 작업은 철저한 안전 점검과 규정 준수 하에 진행되며, 고객님의 소중한 자산과 현장의 안전을 확보하기 위해 최선을 다합니다.\n\n궁금하신 점이나 필요한 작업이 있으시면 언제든지 편하게 문의하십시오. 신뢰와 기술력으로 보답하겠습니다.`,
  careers: [
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
  profileImage: '',
};

@Injectable()
export class AdminProfileService {
  async getProfile(): Promise<{ data: AdminProfileResponseDto }> {
    return { data: profile };
  }

  async updateProfile(
    updateDto: AdminProfileUpdateDto,
  ): Promise<{ data: AdminProfileResponseDto }> {
    profile = { ...profile, ...updateDto };
    return { data: profile };
  }
}
