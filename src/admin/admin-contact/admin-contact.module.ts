import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from '../../schema/contact.schema';
import { ContactSetting, ContactSettingSchema } from '../../schema/contact-setting.schema';
import { ContactInquiry, ContactInquirySchema } from '../../schema/contact-inquiry.schema';
import { AdminContactController } from './admin-contact.controller';
import { AdminContactService } from './admin-contact.service';
import { ContactService } from '../../service/contact/contact.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contact.name, schema: ContactSchema },
      { name: ContactSetting.name, schema: ContactSettingSchema },
      { name: ContactInquiry.name, schema: ContactInquirySchema },
    ]),
  ],
  controllers: [AdminContactController],
  providers: [AdminContactService, ContactService],
})
export class AdminContactModule {}
