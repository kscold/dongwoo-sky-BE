// 장비/차량 통합 목업 데이터 추가 스크립트
require('dotenv').config();
const { MongoClient } = require('mongodb');

const sampleEquipmentVehicles = [
    // --- 장비 샘플 ---
    {
        name: '60톤 크레인',
        description: '대형 건설 현장에서 사용되는 60톤급 크레인입니다. 높은 안전성과 정교한 작업이 가능하며, 최대 45m 높이까지 작업할 수 있습니다.',
        specifications: '최대 하중: 60톤\n최대 높이: 45m\n작업 반경: 35m\n엔진: 디젤 380HP',
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
        imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop',
        isActive: true,
        sortOrder: 1,
        type: 'equipment',
        showInService: true,
        showInPricing: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    // --- 차량 샘플 ---
    {
        name: '소형 사다리차',
        description: '높이 15m까지 작업 가능한 소형 사다리차입니다.',
        specifications: '작업높이: 15m, 바스켓 용량: 200kg, 차량 길이: 7m',
        iconUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=100&h=100&fit=crop&crop=center',
        priceRanges: [
            '기본 4시간: 180,000원',
            '추가 시간당: 30,000원',
            '야간 할인(18시~06시): 20%',
            '주말/공휴일 할인: 30%',
        ],
        isActive: true,
        sortOrder: 2,
        type: 'vehicle',
        showInService: true,
        showInPricing: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    // 필요시 더 추가
];

async function main() {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/dongwoo-sky';
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db();
        const col = db.collection('equipments');
        await col.deleteMany({});
        await col.insertMany(sampleEquipmentVehicles);
        console.log('샘플 장비/차량 데이터가 추가되었습니다.');
    } finally {
        await client.close();
    }
}

main();
