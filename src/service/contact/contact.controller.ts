import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactInquiryDto } from './dto/create-contact-inquiry.dto';
import { Request } from 'express';

@Controller('service/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get('settings')
  async getContactSettings() {
    return await this.contactService.getContactSettings();
  }

  @Post('inquiry')
  async createContactInquiry(
    @Body() createContactInquiryDto: CreateContactInquiryDto,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    
    return await this.contactService.createContactInquiry(
      createContactInquiryDto,
      ipAddress,
      userAgent,
    );
  }
}