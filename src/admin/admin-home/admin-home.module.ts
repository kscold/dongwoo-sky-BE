import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminHomeController } from './admin-home.controller';
import { AdminHomeService } from './admin-home.service';
import { Home, HomeSchema } from '../../schema/home.schema';
import { CommonModule } from '../../common/common.module';
import { AdminUserModule } from '../admin-user/admin-user.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Home.name, schema: HomeSchema },
        ]),
        CommonModule,
        AdminUserModule,
    ],
    controllers: [AdminHomeController],
    providers: [AdminHomeService],
    exports: [AdminHomeService],
})
export class AdminHomeModule { }
