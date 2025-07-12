import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminWorkShowcaseService } from './admin-work-showcase.service';
import { AdminWorkShowcaseController } from './admin-work-showcase.controller';
import { WorkShowcase, WorkShowcaseSchema } from '../../schema/work-showcase.schema';
import { CommonModule } from '../../common/common.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: WorkShowcase.name, schema: WorkShowcaseSchema },
        ]),
        CommonModule,
    ],
    controllers: [AdminWorkShowcaseController],
    providers: [AdminWorkShowcaseService],
    exports: [AdminWorkShowcaseService],
})
export class AdminWorkShowcaseModule { } 