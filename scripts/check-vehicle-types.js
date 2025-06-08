const { MongoClient } = require('mongodb');
const client = new MongoClient('mongodb://localhost:27017');

async function checkActiveVehicleTypes() {
  try {
    await client.connect();
    const db = client.db('dongwoo-sky');

    console.log('=== vehicletypes 컬렉션의 isActive 필드 확인 ===');
    const allDocs = await db.collection('vehicletypes').find({}).toArray();
    console.log('전체 문서 수:', allDocs.length);

    allDocs.forEach((doc, index) => {
      console.log(`문서 ${index + 1}:`);
      console.log('  _id:', doc._id);
      console.log('  name:', doc.name);
      console.log('  isActive:', doc.isActive);
      console.log('  hasIsActive:', doc.hasOwnProperty('isActive'));
    });

    console.log('\n=== isActive: true 조건으로 검색 ===');
    const activeDocs = await db
      .collection('vehicletypes')
      .find({ isActive: true })
      .toArray();
    console.log('isActive: true인 문서 수:', activeDocs.length);

    console.log('\n=== isActive 필드 없는 문서 검색 ===');
    const noActiveDocs = await db
      .collection('vehicletypes')
      .find({ isActive: { $exists: false } })
      .toArray();
    console.log('isActive 필드가 없는 문서 수:', noActiveDocs.length);
  } catch (error) {
    console.error('에러:', error);
  } finally {
    await client.close();
  }
}

checkActiveVehicleTypes();
