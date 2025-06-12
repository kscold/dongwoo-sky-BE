// 컨텐츠 설정 초기화 스크립트
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri =
  process.env.DATABASE_URL ||
  'mongodb+srv://ks_cold:Tmdcks6502%40@dongwoo-sky.dz7hnbp.mongodb.net/dongwoo-sky';

async function initializeContentSettings() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('MongoDB에 연결되었습니다.');

    const db = client.db();

    const defaultSettings = [
      {
        key: 'content_section_title',
        title: '어울림 스카이 소식 제목',
        description: '메인 페이지 컨텐츠 섹션의 제목',
        value: '어울림 스카이 소식',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'content_section_subtitle',
        title: '어울림 스카이 소식 부제목',
        description: '메인 페이지 컨텐츠 섹션의 부제목',
        value:
          '현장에서 일어나는 생생한 이야기와 고객님들의 소중한 후기를 확인해보세요',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'work_showcases_title',
        title: '작업자 자랑거리 제목',
        description: '작업자 자랑거리 섹션의 제목',
        value: '작업자 자랑거리',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        key: 'customer_reviews_title',
        title: '고객 리뷰 제목',
        description: '고객 리뷰 섹션의 제목',
        value: '고객 리뷰',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    // 기존 설정 삭제 후 새로 추가
    await db.collection('contentsettings').deleteMany({});

    const result = await db
      .collection('contentsettings')
      .insertMany(defaultSettings);
    console.log(`컨텐츠 설정 ${result.insertedCount}개가 추가되었습니다.`);

    console.log('컨텐츠 설정 초기화가 완료되었습니다!');
  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await client.close();
    console.log('MongoDB 연결이 종료되었습니다.');
  }
}

initializeContentSettings();
