const { MongoClient } = require('mongodb');

async function checkAdminUsers() {
  const uri =
    'mongodb+srv://ks_cold:Tmdcks6502%40@dongwoo-sky.dz7hnbp.mongodb.net/dongwoo-sky';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('MongoDB Atlas에 연결되었습니다.');

    const db = client.db('dongwoo-sky');
    const usersCollection = db.collection('users');

    // 모든 관리자 계정 조회
    const adminUsers = await usersCollection.find({ role: 'admin' }).toArray();

    console.log('=== 관리자 계정 목록 ===');
    if (adminUsers.length === 0) {
      console.log('관리자 계정이 없습니다.');
    } else {
      adminUsers.forEach((user, index) => {
        console.log(
          `${index + 1}. 이메일: ${user.email}, 이름: ${user.name}, 활성: ${user.isActive}`,
        );
      });
    }
    console.log('====================');
  } catch (error) {
    console.error('에러 발생:', error);
  } finally {
    await client.close();
  }
}

checkAdminUsers();
