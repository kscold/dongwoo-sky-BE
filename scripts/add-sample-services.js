const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function addSampleServices() {
  try {
    await client.connect();
    console.log('MongoDB에 연결되었습니다.');

    const database = client.db();
    const services = database.collection('services');

    // 기존 데이터 삭제
    await services.deleteMany({});
    console.log('기존 서비스 데이터를 삭제했습니다.');

    // 샘플 서비스 데이터
    const sampleServices = [
      {
        title: '건물 외벽 공사 및 보수',
        description:
          '고층 건물의 외벽 공사, 타일 보수, 방수 작업 등 전문적인 외벽 관련 작업을 수행합니다.',
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: '간판 및 현수막 설치/철거',
        description:
          '각종 간판, 현수막, 광고물의 설치 및 철거 작업을 안전하고 신속하게 처리합니다.',
        isActive: true,
        sortOrder: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: '유리 및 외벽 청소',
        description:
          '고층 건물의 유리창 청소, 외벽 청소 등 정밀하고 깨끗한 청소 서비스를 제공합니다.',
        isActive: true,
        sortOrder: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: '건설 자재 운반 및 상하차',
        description:
          '무거운 건설 자재의 안전한 운반과 정확한 위치로의 상하차 작업을 수행합니다.',
        isActive: true,
        sortOrder: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: '조경 작업 및 수목 관리',
        description:
          '고소 수목 관리, 가지치기, 조경 시설물 설치 등 전문적인 조경 작업을 제공합니다.',
        isActive: true,
        sortOrder: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: '기타 중량물 작업 및 고소 작업 일체',
        description:
          '다양한 중량물 취급과 고소에서의 모든 작업을 안전하고 전문적으로 수행합니다.',
        isActive: true,
        sortOrder: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const result = await services.insertMany(sampleServices);
    console.log(`${result.insertedCount}개의 서비스 데이터가 추가되었습니다.`);

    // 추가된 데이터 확인
    const count = await services.countDocuments();
    console.log(`현재 총 ${count}개의 서비스가 저장되어 있습니다.`);
  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await client.close();
    console.log('MongoDB 연결이 종료되었습니다.');
  }
}

addSampleServices();
