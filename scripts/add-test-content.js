// MongoDB 컨텐츠 테스트 데이터 생성 스크립트
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri =
  process.env.DATABASE_URL ||
  'mongodb+srv://ks_cold:Tmdcks6502%40@dongwoo-sky.dz7hnbp.mongodb.net/dongwoo-sky';

async function addTestContent() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('MongoDB에 연결되었습니다.');

    const db = client.db();

    // 작업자 자랑거리 테스트 데이터 (더 많은 데이터)
    const workShowcases = [
      {
        title: '50층 고층 빌딩 외벽 청소 작업 완료',
        content: `<p>안전하고 신속한 고층 빌딩 외벽 청소 작업을 성공적으로 완료했습니다.</p>
                  <p>최신 스카이 장비와 전문 기술력으로 고객의 만족도 100%를 달성했습니다.</p>
                  <p>작업 기간: 3일, 작업 높이: 200m, 작업면적: 5,000㎡</p>`,
        imageUrls: [
          'https://images.unsplash.com/photo-1506784983877-45594efa4c88?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ],
        authorName: '김철수',
        authorRole: '고층 작업 전문가',
        projectLocation: '서울 강남구',
        equipmentUsed: '스카이 리프트 SL-200',
        isActive: true,
        viewCount: 156,
        likeCount: 23,
        publishedAt: new Date('2025-06-10T09:00:00Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: '대형 쇼핑몰 천장 설치 작업',
        content: `<p>대형 쇼핑몰의 대형 조명 시설 천장 설치 작업을 무사히 완료했습니다.</p>
                  <p>정밀한 작업과 안전 관리로 예정보다 하루 일찍 완공했습니다.</p>
                  <p>고객사로부터 "최고의 품질과 서비스"라는 평가를 받았습니다.</p>`,
        imageUrls: [
          'https://images.unsplash.com/photo-1485470733090-0aae1788d5af?q=80&w=2117&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ],
        authorName: '박영희',
        authorRole: '실내 고소 작업 전문가',
        projectLocation: '경기도 수원시',
        equipmentUsed: '가위식 리프트 SL-120',
        isActive: true,
        viewCount: 89,
        likeCount: 15,
        publishedAt: new Date('2025-06-09T14:30:00Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: '교량 점검 및 보수 작업',
        content: `<p>중요 교량의 정기 점검과 보수 작업을 담당했습니다.</p>
                  <p>높이 80m에서의 정밀 검사와 즉시 보수를 통해 안전성을 확보했습니다.</p>`,
        imageUrls: [
          'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
        ],
        authorName: '이민수',
        authorRole: '교량 점검 전문가',
        projectLocation: '부산 해운대구',
        equipmentUsed: '인양기 IC-150',
        isActive: true,
        viewCount: 67,
        likeCount: 8,
        publishedAt: new Date('2025-06-08T11:15:00Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: '병원 신축 건물 유리창 설치',
        content: `<p>새로 건설된 종합병원의 대형 유리창 설치 작업을 수행했습니다.</p>
                  <p>의료진과 환자들의 안전을 최우선으로 하는 세심한 작업을 진행했습니다.</p>`,
        imageUrls: [
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
        ],
        authorName: '정윤아',
        authorRole: '건축 외장 전문가',
        projectLocation: '대전 중구',
        equipmentUsed: '트럭 마운트 TM-180',
        isActive: true,
        viewCount: 124,
        likeCount: 19,
        publishedAt: new Date('2025-06-07T16:45:00Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: '산업단지 대형 간판 설치',
        content: `<p>산업단지 내 대형 기업의 간판 설치 작업을 맡았습니다.</p>
                  <p>야간 작업으로 진행되어 어려움이 있었지만 성공적으로 완료했습니다.</p>`,
        imageUrls: [
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
        ],
        authorName: '최동현',
        authorRole: '야간 작업 전문가',
        projectLocation: '인천 남동구',
        equipmentUsed: '스카이 리프트 SL-160',
        isActive: true,
        viewCount: 78,
        likeCount: 12,
        publishedAt: new Date('2025-06-06T22:00:00Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: '문화재 보수 작업',
        content: `<p>중요 문화재의 지붕 보수 작업을 담당했습니다.</p>
                  <p>문화재의 가치를 보존하면서 안전하게 보수하는 것이 핵심이었습니다.</p>`,
        imageUrls: [
          'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
        ],
        authorName: '서민정',
        authorRole: '문화재 보수 전문가',
        projectLocation: '경주시',
        equipmentUsed: '특수 리프트 SP-100',
        isActive: true,
        viewCount: 203,
        likeCount: 34,
        publishedAt: new Date('2025-06-05T10:30:00Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // 고객 리뷰 테스트 데이터 (더 많은 데이터)
    const customerReviews = [
      {
        title: '신속하고 안전한 서비스에 감사드립니다',
        content: `<p>우리 회사 사옥 외벽 청소를 의뢰했는데, 정말 만족스러운 결과였습니다.</p>
                  <p>작업자분들이 매우 전문적이고 안전수칙을 철저히 지켜주셔서 안심할 수 있었습니다.</p>
                  <p>특히 예상보다 빠른 작업 완료와 깨끗한 마무리가 인상적이었습니다.</p>
                  <p>다음에도 꼭 어울림 스카이와 함께 하겠습니다!</p>`,
        imageUrls: [
          'https://images.unsplash.com/photo-1506784983877-45594efa4c88?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        ],
        customerName: '김대표',
        customerCompany: '(주)테크이노베이션',
        projectLocation: '서울 서초구',
        serviceType: '외벽 청소',
        rating: 5,
        isActive: true,
        viewCount: 245,
        helpfulCount: 67,
        publishedAt: new Date('2025-06-09T11:00:00Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: '합리적인 가격에 최고의 품질!',
        content: `<p>쇼핑몰 천장 조명 교체 작업을 맡겼는데, 기대 이상의 서비스를 받았습니다.</p>
                  <p>견적부터 작업 완료까지 모든 과정이 투명하고 신속했습니다.</p>
                  <p>무엇보다 다른 업체 대비 30% 저렴한 가격에 더 나은 품질을 제공해주셨어요.</p>
                  <p>주변 사업자들에게도 적극 추천하고 있습니다.</p>`,
        imageUrls: [],
        customerName: '이사장',
        customerCompany: '롯데마트 수원점',
        projectLocation: '경기도 수원시',
        serviceType: '천장 조명 설치',
        rating: 4,
        isActive: true,
        viewCount: 198,
        helpfulCount: 45,
        publishedAt: new Date('2025-06-07T16:45:00Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: '전문성과 신뢰성이 돋보이는 업체',
        content: `<p>병원 신축 건물의 유리창 설치 작업을 의뢰했습니다.</p>
                  <p>의료 시설의 특수성을 이해하고 완벽한 작업을 해주셨습니다.</p>
                  <p>환자들과 의료진의 안전을 최우선으로 배려해주신 점이 매우 만족스럽습니다.</p>`,
        imageUrls: [
          'https://images.unsplash.com/photo-1485470733090-0aae1788d5af?q=80&w=2117&auto=format&fit=crop&ixlib=rb-4.0.3',
        ],
        customerName: '박원장',
        customerCompany: '서울대병원',
        projectLocation: '서울 종로구',
        serviceType: '유리창 설치',
        rating: 5,
        isActive: true,
        viewCount: 156,
        helpfulCount: 38,
        publishedAt: new Date('2025-06-08T09:30:00Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: '정시 완공과 꼼꼼한 마무리',
        content: `<p>교량 점검 및 보수 작업을 맡겼는데 정말 만족합니다.</p>
                  <p>약속한 일정에 맞춰 정시에 완공하셨고, 작업 후 정리정돈도 완벽했습니다.</p>
                  <p>시민들의 안전을 위한 중요한 작업을 신뢰할 수 있게 해주셔서 감사합니다.</p>`,
        imageUrls: [],
        customerName: '최팀장',
        customerCompany: '부산시청 도로교통과',
        projectLocation: '부산 해운대구',
        serviceType: '교량 점검',
        rating: 4,
        isActive: true,
        viewCount: 87,
        helpfulCount: 21,
        publishedAt: new Date('2025-06-06T14:15:00Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: '야간 작업도 완벽하게!',
        content: `<p>산업단지 내 대형 간판 설치를 야간에 작업해주셨습니다.</p>
                  <p>주간 업무에 지장을 주지 않기 위한 배려와 전문적인 야간 작업 노하우가 돋보였습니다.</p>
                  <p>소음 최소화와 안전 관리까지 완벽했습니다.</p>`,
        imageUrls: [
          'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
        ],
        customerName: '정과장',
        customerCompany: '현대제철 인천공장',
        projectLocation: '인천 남동구',
        serviceType: '간판 설치',
        rating: 5,
        isActive: true,
        viewCount: 123,
        helpfulCount: 29,
        publishedAt: new Date('2025-06-05T22:45:00Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: '문화재 보호에 대한 깊은 이해',
        content: `<p>중요 문화재 보수 작업을 신뢰하고 맡길 수 있었습니다.</p>
                  <p>문화재의 가치를 보존하면서도 필요한 보수를 완벽하게 수행해주셨습니다.</p>
                  <p>전통 기법과 현대 기술의 조화가 인상적이었습니다.</p>`,
        imageUrls: [],
        customerName: '유학예사',
        customerCompany: '경주시 문화재과',
        projectLocation: '경주시',
        serviceType: '문화재 보수',
        rating: 5,
        isActive: true,
        viewCount: 267,
        helpfulCount: 84,
        publishedAt: new Date('2025-06-04T13:20:00Z'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // 데이터 삽입
    const workResult = await db
      .collection('work_showcases')
      .insertMany(workShowcases);
    console.log(
      `작업자 자랑거리 ${workResult.insertedCount}개가 추가되었습니다.`,
    );

    const reviewResult = await db
      .collection('customer_reviews')
      .insertMany(customerReviews);
    console.log(`고객 리뷰 ${reviewResult.insertedCount}개가 추가되었습니다.`);

    console.log('테스트 컨텐츠 데이터가 성공적으로 추가되었습니다!');
  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await client.close();
    console.log('MongoDB 연결이 종료되었습니다.');
  }
}

addTestContent();
