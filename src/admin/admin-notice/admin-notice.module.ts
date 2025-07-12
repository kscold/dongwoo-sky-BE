import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminNoticeController } from './admin-notice.controller'; 

import { AdminNoticeService } from './admin-notice.service'; 

import { Notice, NoticeSchema } from '../../schema/notice.schema';

import { CommonModule } from '../../common/common.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule,
    MongooseModule.forFeature([{ name: Notice.name, schema: NoticeSchema }]),
    CommonModule,
  ],
  controllers: [AdminNoticeController],
  providers: [AdminNoticeService],
})
export class AdminNoticeModule {} 