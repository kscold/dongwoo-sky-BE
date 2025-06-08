// MongoDB 컬렉션 확인 스크립트
require('dotenv').config();
const { MongoClient } = require('mongodb');

async function checkCollections() {
  const uri =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/dongwoo-sky';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('MongoDB에 연결되었습니다.');

    const db = client.db('dongwoo-sky');

    // 모든 컬렉션 이름 확인
    const collections = await db.listCollections().toArray();
    console.log('사용 가능한 컬렉션들:');
    collections.forEach((collection) => {
      console.log(`- ${collection.name}`);
    });

    // equipments 컬렉션에서 데이터 확인
    console.log('\n=== equipments 컬렉션 ===');
    const equipmentsCollection = db.collection('equipments');
    const equipmentsCount = await equipmentsCollection.countDocuments();
    console.log(`equipments 컬렉션 문서 수: ${equipmentsCount}`);

    // NestJS가 사용할 수 있는 다른 이름들 확인
    const possibleNames = ['equipment', 'equipments'];
    for (const name of possibleNames) {
      const collection = db.collection(name);
      const count = await collection.countDocuments();
      console.log(`${name} 컬렉션 문서 수: ${count}`);
    }
  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await client.close();
    console.log('MongoDB 연결을 종료했습니다.');
  }
}

checkCollections();
