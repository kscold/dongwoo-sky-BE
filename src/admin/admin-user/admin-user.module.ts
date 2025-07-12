import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schema/user.schema';
import { AdminUserController } from './admin-user.controller';
import { AdminUserService } from './admin-user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
  ],
  controllers: [AdminUserController],
  providers: [AdminUserService, JwtStrategy, LocalStrategy],
  exports: [AdminUserService],
})
export class AdminUserModule { }
