import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ContactSetting, ContactSettingSchema } from '../../schema/contact-setting.schema';
import { ContactInquiry, ContactInquirySchema } from '../../schema/contact-inquiry.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ContactSetting.name, schema: ContactSettingSchema },
      { name: ContactInquiry.name, schema: ContactInquirySchema },
    ]),
  ],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}