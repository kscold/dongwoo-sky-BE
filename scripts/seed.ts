import { connect, connection, Types } from 'mongoose';
import { config } from 'dotenv';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';

// Load environment variables
config();

// Import all schemas
import { User, UserSchema, UserRole } from '../src/schema/user.schema';
import { SiteSetting, SiteSettingSchema } from '../src/schema/site-setting.schema';
import { Contact, ContactSchema } from '../src/schema/contact.schema';
import { CustomerReview, CustomerReviewSchema } from '../src/schema/customer-review.schema';
import { Equipment, EquipmentSchema } from '../src/schema/equipment.schema';
import { Home, HomeSchema } from '../src/schema/home.schema';
import { Notice, NoticeSchema } from '../src/schema/notice.schema';
import { Profile, ProfileSchema } from '../src/schema/profile.schema';
import { Service, ServiceSchema } from '../src/schema/service.schema';
import { WorkShowcase, WorkShowcaseSchema } from '../src/schema/work-showcase.schema';

const MONGODB_URI = process.env.MONGODB_URI;

const seedDatabase = async () => {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env file');
    process.exit(1);
  }

  try {
    await connect(MONGODB_URI);
    console.log('MongoDB connected successfully.');

    console.log('Clearing existing data...');
    await Promise.all(Object.values(connection.models).map(model => model.deleteMany({})));

    console.log('Seeding new data...');

    // 1. Users (Admin)
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('admin1234', salt);
    const adminUser = await connection.model('User', UserSchema).create({
      email: 'admin@eoullim.sky',
      password: hashedPassword,
      name: '관리자',
      role: UserRole.ADMIN,
      isApproved: true,
      isActive: true,
    });
    console.log('Admin user created.');

    // 2. Site Settings
    await connection.model('SiteSetting', SiteSettingSchema).create({
      identifier: 'global_settings',
      contactPhoneNumber: '010-1234-5678',
      kakaoOpenChatUrl: 'https://open.kakao.com/o/example',
    });
    console.log('Site settings created.');

    // 3. Equipments
    const equipments = [];
    const equipmentNames = ['스카이차 1톤', '스카이차 2.5톤', '스카이차 3.5톤', '스카이차 5톤', '사다리차', '크레인'];
    for (let i = 0; i < equipmentNames.length; i++) {
      equipments.push({
        name: equipmentNames[i],
        description: `${equipmentNames[i]}에 대한 상세 설명입니다. ${faker.lorem.paragraph()}`,
        imageUrl: faker.image.urlLoremFlickr({ category: 'transport' }),
        isActive: true,
        sortOrder: i + 1,
        tonnage: `${(i + 1) * 10}톤`,
        maxHeight: `${(i + 1) * 15}m`,
        showInPricing: true,
        showInService: true,
      });
    }
    await connection.model('Equipment', EquipmentSchema).insertMany(equipments);
    console.log(`${equipments.length} equipments created.`);

    // 4. Services
    const services = [];
    const serviceTitles = ['간판/현수막 작업', '유리/창호 작업', '건물 외벽 작업', '조경/나무 작업', '기타 고소 작업'];
    for (let i = 0; i < serviceTitles.length; i++) {
      services.push({
        title: serviceTitles[i],
        description: `${serviceTitles[i]}에 대한 상세 설명입니다. 안전하고 신속하게 처리해드립니다.`,
        isActive: true,
        sortOrder: i + 1,
        icon: faker.image.avatar(),
      });
    }
    await connection.model('Service', ServiceSchema).insertMany(services);
    console.log(`${services.length} services created.`);

     // 5. Notices
    const notices = [];
    for (let i = 0; i < 5; i++) {
      notices.push({
        title: `[공지] ${faker.lorem.sentence(5)}`,
        content: faker.lorem.paragraphs(3),
        isPublished: true,
        publishedAt: faker.date.past(),
      });
    }
    await connection.model('Notice', NoticeSchema).insertMany(notices);
    console.log(`${notices.length} notices created.`);

    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await connection.close();
    console.log('MongoDB connection closed.');
  }
};

seedDatabase();
