import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WorkShowcaseController } from './work-showcase.controller'; 

import { WorkShowcaseService } from './work-showcase.service'; 

import {
  WorkShowcase,
  WorkShowcaseSchema,
} from '../../schema/work-showcase.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkShowcase.name, schema: WorkShowcaseSchema },
    ]),
  ],
  controllers: [WorkShowcaseController],
  providers: [WorkShowcaseService],
})
export class WorkShowcaseModule {}
