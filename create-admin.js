const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User 스키마 정의
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);

async function createAdmin() {
  try {
    // MongoDB 연결
    await mongoose.connect('mongodb://localhost:27017/eoullim-sky');
    console.log('MongoDB 연결 성공');

    // 기존 admin 계정 확인
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('관리자 계정이 이미 존재합니다.');
      return;
    }

    // 비밀번호 해시
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // 관리자 계정 생성
    const adminUser = new User({
      username: 'admin',
      email: 'admin@eoullim.com',
      password: hashedPassword,
      name: '관리자',
      role: 'admin',
    });

    await adminUser.save();
    console.log('✅ 관리자 계정이 성공적으로 생성되었습니다!');
    console.log('Username: admin');
    console.log('Password: admin123');
  } catch (error) {
    console.error('❌ 관리자 계정 생성 실패:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB 연결 종료');
  }
}

createAdmin();
