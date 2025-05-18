'use client';

import React from 'react';
import Link from 'next/link';
import {
  BuildingOffice2Icon, // 장비 아이콘 예시
  WrenchScrewdriverIcon, // 작업 범위 아이콘, 서비스 진행 아이콘
  UserCircleIcon, // 팀원 프로필 아이콘
  CheckCircleIcon, // 작업 가능 범위 아이콘
  ChatBubbleBottomCenterTextIcon, // 서비스 진행 아이콘
  TruckIcon, // 서비스 진행 아이콘
  CreditCardIcon, // 서비스 진행 아이콘
  PhotoIcon, // 이미지 Placeholder 아이콘
  // UserIcon // 사용하지 않음
} from '@heroicons/react/24/solid';
import * as styles from '../../../styles/service-guide.css';
import * as contactStyles from '../../../styles/contact.css'; // 서비스 진행 순서 스타일 재활용

// 장비 데이터 예시
const equipmentData = [
  {
    name: '스카이차 (고소작업차)',
    description: '최대 75m까지 작업 가능한 다양한 높이의 스카이차를 보유하고 있습니다. 건물 외벽 청소, 페인트, 간판 설치/철거, 유리 교체, 가지치기 등 정밀하고 안전한 고소 작업을 지원합니다.',
    imagePlaceholder: '스카이차 이미지',
  },
  {
    name: '카고 크레인 (5톤 ~ 25톤)',
    description: '다양한 톤수의 카고 크레인을 통해 건설 자재, 중량 기계, 컨테이너 등 무거운 화물의 상하차 및 운반 작업을 신속하고 안전하게 처리합니다. 협소한 공간 작업도 가능합니다.',
    imagePlaceholder: '카고 크레인 이미지',
  },
  {
    name: '미니 굴착기 (0.8톤 ~ 3.5톤)',
    description: '도심 협소 공간, 실내 철거, 배관 공사, 조경 작업 등에 최적화된 소형 굴착기입니다. 강력한 굴착력과 섬세한 작업 능력을 겸비하여 효율적인 작업 진행을 돕습니다.',
    imagePlaceholder: '미니 굴착기 이미지',
  },
];

// 작업 가능 범위 데이터 예시
const capabilitiesData = [
  { text: '건물 외벽 공사 및 보수', icon: CheckCircleIcon },
  { text: '간판 및 현수막 설치/철거', icon: CheckCircleIcon },
  { text: '유리 및 외벽 청소', icon: CheckCircleIcon },
  { text: '건설 자재 운반 및 상하차', icon: CheckCircleIcon },
  { text: '조경 작업 및 수목 관리', icon: CheckCircleIcon },
  { text: '기타 중량물 작업 및 고소 작업 일체', icon: CheckCircleIcon },
];

// 단일 작업자 프로필 데이터
const operatorProfileData = {
  name: '현동우 대표 (사장)',
  role: '동우스카이 대표 / 20년 경력 종합 장비 전문가',
  imageUrl: '', // 실제 이미지 URL 또는 Placeholder 경로
  bio: `고객 여러분의 안전과 만족을 최우선으로 생각하는 동우스카이 대표 현동우입니다.\n20년간 다양한 현장에서 쌓아온 경험과 노하우를 바탕으로, 고객님의 어떤 작업 요구에도 최적의 솔루션을 제공해왔습니다.\n스카이차, 크레인, 굴착기 등 모든 장비를 직접 운용하고 정비하며, 항상 최상의 장비 상태를 유지하고 있습니다.\n\n안전은 그 무엇과도 바꿀 수 없는 가치입니다. 모든 작업은 철저한 안전 점검과 규정 준수 하에 진행되며, 고객님의 소중한 자산과 현장의 안전을 확보하기 위해 최선을 다합니다.\n\n궁금하신 점이나 필요한 작업이 있으시면 언제든지 편하게 문의하십시오. 신뢰와 기술력으로 보답하겠습니다.`,
  career: [
    '2003년 ~ 현재: 동우스카이 중장비 운영 대표',
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

// 서비스 진행 순서 데이터 (contact/page.tsx와 동일)
const serviceProcessSteps = [
  {
    number: '01',
    icon: ChatBubbleBottomCenterTextIcon,
    title: '고객 배차신청 접수',
    description: '전화 및 온라인으로 상담 후 장비차량 배차신청',
  },
  {
    number: '02',
    icon: TruckIcon,
    title: '차량조회/배차확정',
    description: '인접차량 실시간 검색 후 제일 적합한 차량으로 배정',
  },
  {
    number: '03',
    icon: WrenchScrewdriverIcon,
    title: '현장 서비스',
    description: '최대한 고객 요구사항에 맞춰 안전한 현장 서비스 시행',
  },
  {
    number: '04',
    icon: CreditCardIcon,
    title: '결제',
    description: '저희 사다리차 협동조합에서는 반드시 당일 수금을 원칙으로 합니다.',
  },
];

export default function ServiceGuidePage() {
  const { name, role, imageUrl, bio, career, skills } = operatorProfileData;

  return (
    <div className={styles.pageWrapper}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>동우스카이 서비스 안내</h1>
        <p className={styles.heroSubtitle}>
          고객님의 안전과 만족을 최우선으로 생각하는 동우스카이입니다. 다양한 최신 장비와 숙련된 전문 작업팀이 안전하고 신속한 서비스를 제공합니다.
        </p>
      </div>

      {/* 장비 소개 Section */}
      <div className={styles.sectionContainer}>
        <h2 className={styles.sectionTitle}>보유 장비 소개</h2>
        <div className={styles.equipmentGrid}>
          {equipmentData.map((item) => (
            <div key={item.name} className={styles.equipmentCard}>
              <div className={styles.equipmentImagePlaceholder}>
                <PhotoIcon style={{ width: '50px', height: '50px', marginRight: '8px' }} /> {item.imagePlaceholder}
              </div>
              <div className={styles.equipmentContent}>
                <h3 className={styles.equipmentTitle}>{item.name}</h3>
                <p className={styles.equipmentDescription}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 작업 가능 범위 Section */}
      <div className={styles.sectionContainer}>
        <h2 className={styles.sectionTitle}>작업 가능 범위</h2>
        <ul className={styles.capabilitiesList}>
          {capabilitiesData.map((item) => (
            <li key={item.text} className={styles.capabilityItem}>
              <item.icon className={styles.capabilityIcon} aria-hidden="true" />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* --- 수정된 작업자 프로필 섹션 --- */}
      <div className={styles.operatorProfileSection}>
        <h2 className={styles.sectionTitle}>대표 프로필</h2>
        <div className={styles.profileCard}>
          <div className={styles.profileImageContainer}>
            {imageUrl ? (
              <img src={imageUrl} alt={name} style={{ width: '100%', borderRadius: '1rem' }} />
            ) : (
              <div className={styles.profileImagePlaceholder}>
                <UserCircleIcon />
              </div>
            )}
          </div>
          <div className={styles.profileInfo}>
            <h3 className={styles.profileName}>{name}</h3>
            <p className={styles.profileRole}>{role}</p>
            
            <h4 className={styles.profileSectionTitle}>소개</h4>
            <p className={styles.profileBio}>{bio}</p>

            {career && career.length > 0 && (
              <>
                <h4 className={styles.profileSectionTitle}>주요 경력</h4>
                <ul className={styles.profileList}>
                  {career.map((item, index) => (
                    <li key={index} className={styles.profileListItem}>{item}</li>
                  ))}
                </ul>
              </>
            )}

            {skills && skills.length > 0 && (
              <>
                <h4 className={styles.profileSectionTitle}>보유 기술 및 자격</h4>
                <ul className={styles.profileList}>
                  {skills.map((item, index) => (
                    <li key={index} className={styles.profileListItem}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 서비스 진행 순서 Section (contact/page.tsx와 동일 스타일 사용) */}
      <div className={contactStyles.serviceProcessSection}> {/* contactStyles 사용 */}
        <h2 className={contactStyles.sectionTitle}>서비스 계약 프로세스</h2>
        <div className={contactStyles.processGrid}>
          {serviceProcessSteps.map((step) => (
            <div key={step.number} className={contactStyles.processStep}>
              <div className={contactStyles.processStepNumber}>{step.number}</div>
              <step.icon className={contactStyles.processStepIcon} aria-hidden="true" />
              <h3 className={contactStyles.processStepTitle}>{step.title}</h3>
              <p className={contactStyles.processStepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 이용 요금 안내 버튼 Section */}
      <div className={styles.pricingButtonContainer}>
        <Link href="/pricing" className={styles.pricingButton}>
          이용 요금 확인하기
        </Link>
      </div>
    </div>
  );
} 