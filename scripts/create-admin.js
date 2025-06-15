const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  const uri =
    'mongodb+srv://ks_cold:Tmdcks6502%40@dongwoo-sky.dz7hnbp.mongodb.net/dongwoo-sky';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('MongoDB Atlas에 연결되었습니다.');

    const db = client.db('dongwoo-sky');
    const usersCollection = db.collection('users');

    // 기존 관리자 계정 확인
    const existingAdmin = await usersCollection.findOne({
      email: 'admin@eoullim.com',
    });
    if (existingAdmin) {
      console.log('이미 관리자 계정이 존재합니다.');
      return;
    }

    // 관리자 계정 생성
    const hashedPassword = await bcrypt.hash('admin123456', 10);
    const adminUser = {
      email: 'admin@eoullim.com',
      password: hashedPassword,
      name: '관리자',
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(adminUser);
    console.log('관리자 계정이 생성되었습니다:', result.insertedId);
    console.log('이메일: admin@eoullim.com');
    console.log('비밀번호: admin123456');
  } catch (error) {
    console.error('에러 발생:', error);
  } finally {
    await client.close();
  }
}

createAdminUser();
