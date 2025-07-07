import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { AdminServiceGuideController } from "./admin-service-guide.controller"
import { AdminServiceGuideService } from "./admin-service-guide.service"
import {
    ServiceGuide,
    ServiceGuideSchema,
} from "../../schema/service-guide.schema"
import { AdminUserModule } from "../admin-user/admin-user.module"

@Module({
    imports: [
        AdminUserModule,
        MongooseModule.forFeature([
            { name: ServiceGuide.name, schema: ServiceGuideSchema },
        ]),
    ],
    controllers: [AdminServiceGuideController],
    providers: [AdminServiceGuideService],
})
export class AdminServiceGuideModule { } 