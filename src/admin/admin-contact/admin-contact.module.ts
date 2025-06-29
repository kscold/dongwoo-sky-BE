import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from '../../schema/contact.schema';
import { AdminContactController } from './admin-contact.controller';
import { AdminContactService } from './admin-contact.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
  ],
  controllers: [AdminContactController],
  providers: [AdminContactService],
})
export class AdminContactModule {}
