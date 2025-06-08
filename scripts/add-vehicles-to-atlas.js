const { MongoClient } = require('mongodb');
require('dotenv').config();

const sampleVehicleTypes = [
  {
    name: '소형 사다리차',
    type: 'ladder',
    iconUrl:
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=100&h=100&fit=crop&crop=center',
    description: '높이 15m까지 작업 가능한 소형 사다리차입니다.',
    specifications: '작업높이: 15m, 바스켓 용량: 200kg, 차량 길이: 7m',
    priceRanges: [
      '기본 4시간: 180,000원',
      '추가 시간당: 30,000원',
      '야간 할증(18시~06시): 20%',
      '주말/공휴일 할증: 30%',
    ],
    isActive: true,
    sortOrder: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: '중형 사다리차',
    type: 'ladder',
    iconUrl:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center',
    description: '높이 25m까지 작업 가능한 중형 사다리차입니다.',
    specifications: '작업높이: 25m, 바스켓 용량: 300kg, 차량 길이: 9m',
    priceRanges: [
      '기본 4시간: 250,000원',
      '추가 시간당: 45,000원',
      '야간 할증(18시~06시): 20%',
      '주말/공휴일 할증: 30%',
    ],
    isActive: true,
    sortOrder: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: '대형 사다리차',
    type: 'ladder',
    iconUrl:
      'https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=100&h=100&fit=crop&crop=center',
    description: '높이 35m까지 작업 가능한 대형 사다리차입니다.',
    specifications: '작업높이: 35m, 바스켓 용량: 400kg, 차량 길이: 12m',
    priceRanges: [
      '기본 4시간: 350,000원',
      '추가 시간당: 60,000원',
      '야간 할증(18시~06시): 20%',
      '주말/공휴일 할증: 30%',
    ],
    isActive: true,
    sortOrder: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: '소형 스카이리프트',
    type: 'sky',
    iconUrl:
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=100&h=100&fit=crop&crop=center',
    description: '컴팩트한 스카이리프트로 좁은 공간에서도 작업 가능합니다.',
    specifications: '작업높이: 18m, 바스켓 용량: 230kg, 차량 폭: 1.8m',
    priceRanges: [
      '기본 4시간: 280,000원',
      '추가 시간당: 50,000원',
      '야간 할증(18시~06시): 25%',
      '주말/공휴일 할증: 35%',
    ],
    isActive: true,
    sortOrder: 4,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: '중형 스카이리프트',
    type: 'sky',
    iconUrl:
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=100&h=100&fit=crop&crop=center',
    description: '다양한 각도로 작업이 가능한 중형 스카이리프트입니다.',
    specifications: '작업높이: 28m, 바스켓 용량: 350kg, 수평 도달: 20m',
    priceRanges: [
      '기본 4시간: 400,000원',
      '추가 시간당: 70,000원',
      '야간 할증(18시~06시): 25%',
      '주말/공휴일 할증: 35%',
    ],
    isActive: true,
    sortOrder: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: '대형 스카이리프트',
    type: 'sky',
    iconUrl:
      'https://images.unsplash.com/photo-1597149700942-c4b1b0d5d50e?w=100&h=100&fit=crop&crop=center',
    description: '최고 높이 작업이 가능한 대형 스카이리프트입니다.',
    specifications: '작업높이: 45m, 바스켓 용량: 500kg, 수평 도달: 30m',
    priceRanges: [
      '기본 4시간: 550,000원',
      '추가 시간당: 90,000원',
      '야간 할증(18시~06시): 25%',
      '주말/공휴일 할증: 35%',
    ],
    isActive: true,
    sortOrder: 6,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function addVehiclesToAtlas() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('MongoDB Atlas에 연결되었습니다.');
    console.log(
      '연결 URI:',
      process.env.MONGODB_URI.replace(/:[^:@]*@/, ':****@'),
    );

    const db = client.db('dongwoo-sky');
    const collection = db.collection('vehicles');

    // 기존 데이터 삭제
    const deleteResult = await collection.deleteMany({});
    console.log(`기존 데이터 ${deleteResult.deletedCount}개를 삭제했습니다.`);

    // 새 데이터 추가
    const result = await collection.insertMany(sampleVehicleTypes);
    console.log(
      `${result.insertedCount}개의 차량 타입을 Atlas vehicles 컬렉션에 추가했습니다.`,
    );

    // 추가된 데이터 확인
    const vehicleTypes = await collection.find({}).toArray();
    console.log('\n생성된 차량 타입 (Atlas vehicles 컬렉션):');
    vehicleTypes.forEach((vehicleType, index) => {
      console.log(
        `${index + 1}. ${vehicleType.name} (${vehicleType.type === 'ladder' ? '사다리차' : '스카이리프트'}) - isActive: ${vehicleType.isActive}`,
      );
    });

    // isActive: true 필터 테스트
    console.log('\n=== isActive: true 필터 테스트 ===');
    const activeVehicles = await collection.find({ isActive: true }).toArray();
    console.log(`isActive: true인 차량 수: ${activeVehicles.length}`);
  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await client.close();
    console.log('\nMongoDB Atlas 연결을 종료했습니다.');
  }
}

addVehiclesToAtlas();
