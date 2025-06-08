const { MongoClient } = require('mongodb');

async function debugVehicles() {
  const client = new MongoClient('mongodb://localhost:27017');

  try {
    await client.connect();
    console.log('MongoDB 연결 성공');

    const db = client.db('dongwoo-sky');

    // 모든 컬렉션 확인
    console.log('\n=== 모든 컬렉션 목록 ===');
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`컬렉션: ${collection.name} - 문서 수: ${count}`);
    }

    // vehicles 컬렉션 확인
    console.log('\n=== vehicles 컬렉션 확인 ===');
    const vehiclesCount = await db.collection('vehicles').countDocuments();
    console.log('vehicles 컬렉션 문서 수:', vehiclesCount);

    if (vehiclesCount > 0) {
      console.log('\n=== vehicles 컬렉션의 모든 문서 ===');
      const allDocs = await db.collection('vehicles').find({}).toArray();
      allDocs.forEach((doc, index) => {
        console.log(
          `${index + 1}. ${doc.name} (${doc.type}) - isActive: ${doc.isActive}`,
        );
        console.log(`   _id: ${doc._id}`);
      });

      console.log('\n=== isActive: true 문서만 조회 ===');
      const activeDocs = await db
        .collection('vehicles')
        .find({ isActive: true })
        .toArray();
      console.log(`isActive: true 문서 수: ${activeDocs.length}`);
    }

    // vehicletypes 컬렉션도 확인 (혹시 여기에 있을 수도)
    console.log('\n=== vehicletypes 컬렉션 확인 ===');
    const vehicleTypesCount = await db
      .collection('vehicletypes')
      .countDocuments();
    console.log('vehicletypes 컬렉션 문서 수:', vehicleTypesCount);
  } catch (error) {
    console.error('에러 발생:', error);
  } finally {
    await client.close();
    console.log('\nMongoDB 연결 종료');
  }
}

debugVehicles();
