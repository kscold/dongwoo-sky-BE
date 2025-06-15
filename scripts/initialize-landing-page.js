const { MongoClient } = require('mongodb');

// MongoDB URI - 실제 환경에서는 환경변수로 관리
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/eoullim-sky';

async function initializeLandingPage() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('MongoDB에 연결되었습니다.');

    const db = client.db();
    const collection = db.collection('landingPages');

    // 기존 데이터 확인
    const existingPage = await collection.findOne({ isActive: true });

    if (existingPage) {
      console.log('이미 활성화된 랜딩 페이지가 존재합니다.');
      return;
    }

    // 기본 랜딩 페이지 데이터
    const defaultLandingPage = {
      title: '어울림 스카이 - 중장비 렌탈 서비스',
      heroSection: {
        title: '어울림 스카이',
        subtitle: '안전하고 신뢰할 수 있는 중장비 렌탈 서비스',
        backgroundImageUrl:
          'https://images.unsplash.com/photo-1506784983877-45594efa4c88?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        description:
          '전문적인 고공작업과 중장비 렌탈 서비스를 제공합니다. 안전하고 효율적인 작업으로 고객님의 프로젝트를 성공으로 이끌어드립니다.',
        ctaText: '무료 견적 문의',
        ctaLink: '/contact',
        isActive: true,
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 데이터 삽입
    const result = await collection.insertOne(defaultLandingPage);
    console.log('기본 랜딩 페이지가 생성되었습니다:', result.insertedId);
  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await client.close();
    console.log('MongoDB 연결이 종료되었습니다.');
  }
}

initializeLandingPage();
