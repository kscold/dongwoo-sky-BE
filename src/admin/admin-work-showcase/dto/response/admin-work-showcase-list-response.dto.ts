import { AdminWorkShowcaseResponseDto } from './admin-work-showcase-response.dto';
import { WorkShowcaseDocument } from '../../../../schema/work-showcase.schema';

export interface PaginatedWorkShowcases {
    items: WorkShowcaseDocument[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
}

export class AdminWorkShowcaseListResponseDto {
    items: AdminWorkShowcaseResponseDto[];
    totalPages: number;
    currentPage: number;
    totalItems: number;

    constructor(paginatedData: PaginatedWorkShowcases) {
        this.items = paginatedData.items.map(
            (item) => new AdminWorkShowcaseResponseDto(item),
        );
        this.totalPages = paginatedData.totalPages;
        this.currentPage = paginatedData.currentPage;
        this.totalItems = paginatedData.totalItems;
    }
} 