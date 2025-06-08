// 샘플 장비 데이터 추가 스크립트
// MongoDB에 직접 연결하여 샘플 데이터를 추가합니다

require('dotenv').config();
const { MongoClient } = require('mongodb');

const sampleEquipment = [
  {
    name: '60톤 크레인',
    description:
      '대형 건설 현장에서 사용되는 60톤급 크레인입니다. 높은 안전성과 정밀한 작업이 가능하며, 최대 45m 높이까지 작업할 수 있습니다.',
    specifications:
      '최대 하중: 60톤\n최대 높이: 45m\n작업 반경: 35m\n엔진: 디젤 380HP',
    capabilities: [
      '대형 구조물 설치',
      '고층 건물 작업',
      '중량물 운반',
      '정밀 위치 조정',
    ],
    priceRange: '800,000원 ~ 1,200,000원/일',
    maxHeight: '45m',
    maxWeight: '60톤',
    tonnage: '60톤',
    imageUrl:
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop',
    isActive: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: '25톤 크레인',
    description:
      '중형 건설 현장과 산업시설에 적합한 25톤급 크레인입니다. 기동성이 뛰어나며 다양한 작업 환경에 적응할 수 있습니다.',
    specifications:
      '최대 하중: 25톤\n최대 높이: 30m\n작업 반경: 25m\n엔진: 디젤 250HP',
    capabilities: [
      '중형 구조물 설치',
      '산업시설 작업',
      '장비 운반',
      '일반 건설 작업',
    ],
    priceRange: '500,000원 ~ 800,000원/일',
    maxHeight: '30m',
    maxWeight: '25톤',
    tonnage: '25톤',
    imageUrl:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
    isActive: true,
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: '굴삭기 (15톤급)',
    description:
      '토공사와 철거 작업에 최적화된 15톤급 굴삭기입니다. 강력한 굴삭력과 안정성을 제공하며, 좁은 공간에서도 효율적인 작업이 가능합니다.',
    specifications:
      '운전 중량: 15톤\n엔진 출력: 110HP\n굴삭 깊이: 6.5m\n굴삭 반경: 9.2m',
    capabilities: ['토공사 작업', '철거 작업', '하수도 공사', '조경 작업'],
    priceRange: '300,000원 ~ 500,000원/일',
    maxHeight: '3.2m',
    maxWeight: '15톤',
    tonnage: '15톤',
    imageUrl:
      'https://images.unsplash.com/photo-1572781568193-2603c57c2065?w=800&h=600&fit=crop',
    isActive: true,
    sortOrder: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: '로더 (5톤급)',
    description:
      '자재 운반과 적재 작업에 특화된 5톤급 로더입니다. 뛰어난 기동성과 작업 효율성을 제공하며, 다양한 어태치먼트 사용이 가능합니다.',
    specifications:
      '적재 용량: 5톤\n엔진 출력: 130HP\n리프트 높이: 4.2m\n버킷 용량: 2.3㎥',
    capabilities: ['자재 운반', '적재 작업', '정리 작업', '제설 작업'],
    priceRange: '250,000원 ~ 400,000원/일',
    maxHeight: '4.2m',
    maxWeight: '5톤',
    tonnage: '5톤',
    imageUrl:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    isActive: true,
    sortOrder: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function insertSampleData() {
  const uri =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/dongwoo-sky';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('MongoDB에 연결되었습니다.');

    const db = client.db('dongwoo-sky'); // 명시적으로 데이터베이스 이름 지정
    const collection = db.collection('equipments');

    // 기존 데이터 삭제 (선택사항)
    await collection.deleteMany({});
    console.log('기존 장비 데이터를 삭제했습니다.');

    // 샘플 데이터 삽입
    const result = await collection.insertMany(sampleEquipment);
    console.log(
      `${result.insertedCount}개의 장비 데이터가 성공적으로 추가되었습니다.`,
    );

    // 추가된 데이터 확인
    const count = await collection.countDocuments();
    console.log(`총 ${count}개의 장비 데이터가 있습니다.`);

    // 실제 데이터 내용 확인
    const equipmentList = await collection.find({}).toArray();
    console.log('저장된 장비 데이터:', JSON.stringify(equipmentList, null, 2));
  } catch (error) {
    console.error('데이터 추가 중 오류 발생:', error);
  } finally {
    await client.close();
    console.log('MongoDB 연결을 종료했습니다.');
  }
}

insertSampleData();
