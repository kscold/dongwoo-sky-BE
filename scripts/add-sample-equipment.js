// 통합 장비(차량 포함) 목업 데이터 생성 스크립트
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
    priceRange: '800,000원 ~ 1,200,000원/일',
    tonnage: '60톤',
    maxHeight: '45m',
    maxWeight: '60톤',
    imageUrl:
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop',
    isActive: true,
    sortOrder: 1,
    iconUrl: '',
    priceRanges: ['800,000원/일', '1,200,000원/일'],
    showInService: true,
    showInPricing: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: '소형 사다리차',
    description: '높이 15m까지 작업 가능한 소형 사다리차입니다.',
    specifications: '작업높이: 15m, 바스켓 용량: 200kg, 차량 길이: 7m',
    priceRange: '180,000원 ~ 250,000원/4시간',
    tonnage: '',
    maxHeight: '15m',
    maxWeight: '200kg',
    imageUrl:
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&h=600&fit=crop',
    isActive: true,
    sortOrder: 2,
    iconUrl:
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=100&h=100&fit=crop&crop=center',
    priceRanges: [
      '기본 4시간: 180,000원',
      '추가 시간당: 30,000원',
      '야간 할증(18시~06시): 20%',
      '주말/공휴일 할증: 30%',
    ],
    showInService: true,
    showInPricing: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: '중형 사다리차',
    description: '높이 25m까지 작업 가능한 중형 사다리차입니다.',
    specifications: '작업높이: 25m, 바스켓 용량: 300kg, 차량 길이: 9m',
    priceRange: '250,000원 ~ 350,000원/4시간',
    tonnage: '',
    maxHeight: '25m',
    maxWeight: '300kg',
    imageUrl:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    isActive: true,
    sortOrder: 3,
    iconUrl:
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&crop=center',
    priceRanges: [
      '기본 4시간: 250,000원',
      '추가 시간당: 45,000원',
      '야간 할증(18시~06시): 20%',
      '주말/공휴일 할증: 30%',
    ],
    showInService: true,
    showInPricing: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: '대형 스카이리프트',
    description: '최고 높이 작업이 가능한 대형 스카이리프트입니다.',
    specifications: '작업높이: 45m, 바스켓 용량: 500kg, 수평 도달: 30m',
    priceRange: '550,000원 ~ 700,000원/4시간',
    tonnage: '',
    maxHeight: '45m',
    maxWeight: '500kg',
    imageUrl:
      'https://images.unsplash.com/photo-1597149700942-c4b1b0d5d50e?w=800&h=600&fit=crop',
    isActive: true,
    sortOrder: 4,
    iconUrl:
      'https://images.unsplash.com/photo-1597149700942-c4b1b0d5d50e?w=100&h=100&fit=crop&crop=center',
    priceRanges: [
      '기본 4시간: 550,000원',
      '추가 시간당: 90,000원',
      '야간 할증(18시~06시): 25%',
      '주말/공휴일 할증: 35%',
    ],
    showInService: true,
    showInPricing: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // 필요시 더 추가
];

async function main() {
  const uri =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/dongwoo-sky';
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('dongwoo-sky');
    const col = db.collection('equipments');
    await col.deleteMany({});
    await col.insertMany(sampleEquipment);
    console.log('통합 장비(차량 포함) 목업 데이터가 추가되었습니다.');
  } finally {
    await client.close();
  }
}

main();
