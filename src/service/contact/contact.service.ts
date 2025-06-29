import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from '../../schema/contact.schema';
import { ContactCreateRequestDto } from './dto/contact-create-request.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
  ) {}

  async create(
    createContactDto: ContactCreateRequestDto,
  ): Promise<{ success: boolean }> {
    try {
      const createdContact = new this.contactModel(createContactDto);
      await createdContact.save();
      return { success: true };
    } catch (error) {
      // TODO: Add logger
      throw new InternalServerErrorException(
        '문의를 접수하는 중 오류가 발생했습니다.',
      );
    }
  }
}
