import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from '../../schema/contact.schema';
import { AdminContactListResponseDto } from './dto/response/admin-contact-list-response.dto';

@Injectable()
export class AdminContactService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
  ) {}

  async getContactList(): Promise<AdminContactListResponseDto> {
    const contactDocs = await this.contactModel.find().sort({ createdAt: -1 }).exec();
    const total = await this.contactModel.countDocuments().exec();
    const contacts = contactDocs.map(contact => ({
      _id: (contact._id as any).toHexString(),
      name: contact.name,
      email: contact.email,
      phoneNumber: contact.phoneNumber,
      message: contact.message,
      isRead: contact.isRead,
      createdAt: contact.createdAt,
    }));
    return { contacts, total };
  }

  async markAsRead(id: string): Promise<{ success: boolean }> {
    await this.contactModel.findByIdAndUpdate(id, { isRead: true });
    return { success: true };
  }
}
