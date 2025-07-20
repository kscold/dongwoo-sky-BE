import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerReviewDto } from './create-customer-review.dto';

export class UpdateCustomerReviewDto extends PartialType(CreateCustomerReviewDto) {}