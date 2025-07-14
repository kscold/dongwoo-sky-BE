import { AdminWorkShowcaseResponseDto } from './admin-work-showcase-response.dto';
import { WorkShowcaseDocument } from '../../../../schema/work-showcase.schema';
import { PaginatedResponse } from '../../../../common/dto/common.dto';

export class AdminWorkShowcaseListResponseDto implements PaginatedResponse<AdminWorkShowcaseResponseDto> {
    items: AdminWorkShowcaseResponseDto[];
    totalPages: number;
    currentPage: number;
    totalItems: number;

    constructor(paginatedData: PaginatedResponse<WorkShowcaseDocument>) {
        this.items = paginatedData.items.map(
            (item) => new AdminWorkShowcaseResponseDto(item),
        );
        this.totalPages = paginatedData.totalPages;
        this.currentPage = paginatedData.currentPage;
        this.totalItems = paginatedData.totalItems;
    }
} 