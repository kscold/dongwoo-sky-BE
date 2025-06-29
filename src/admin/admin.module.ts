import { Module } from '@nestjs/common';

import { AdminUserModule } from './admin-user/admin-user.module';
import { AdminAuthGuard } from './admin-user/guard/admin-auth.guard';
import { JwtStrategy } from './admin-user/strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApiResponseInterceptor } from '../common/interceptor/api-response.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AdminProfileModule } from './admin-profile/admin-profile.module';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from '../schema/user.schema';
import { Service, ServiceSchema } from 'src/schema/service.schema';

import { AdminUserController } from './admin-user/admin-user.controller';
import { AdminHomeService } from './admin-home/admin-home.service';
import { CommonModule } from '../common/common.module';
import { AdminProfileController } from './admin-profile/admin-profile.controller';
import { AdminProfileService } from './admin-profile/admin-profile.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Service.name, schema: ServiceSchema },
    ]),
    PassportModule,
    CommonModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'default-secret-key',
        signOptions: { expiresIn: '24h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AdminUserController, AdminProfileController],
  providers: [
    AdminAuthGuard,
    JwtStrategy,
    AdminHomeService,
    AdminProfileService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
  ],
  exports: [
    AdminAuthGuard,
    AdminUserModule,
    JwtStrategy,
    JwtModule,
    PassportModule,
    AdminProfileModule,
    AdminHomeService,
  ],
})
export class AdminModule {}
