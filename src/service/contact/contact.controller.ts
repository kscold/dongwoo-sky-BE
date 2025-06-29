import { Body, Controller, Post } from '@nestjs/common';

import { ContactService } from './contact.service';

import { ContactCreateRequestDto } from './dto/contact-create-request.dto';

@Controller('service/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async create(@Body() createContactDto: ContactCreateRequestDto): Promise<{ success: boolean }> {
    return this.contactService.create(createContactDto);
  }
}
