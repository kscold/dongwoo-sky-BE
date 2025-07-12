import { WorkShowcase, WorkShowcaseDocument } from '../../../../schema/work-showcase.schema';

export class AdminWorkShowcaseResponseDto {
    _id: string;
    title: string;
    content: string;
    authorName: string;
    authorRole?: string;
    projectLocation?: string;
    equipmentUsed?: string;
    imageUrls: string[];
    isActive: boolean;
    viewCount: number;
    likeCount: number;
    publishedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;

    constructor(workShowcase: WorkShowcaseDocument) {
        this._id = workShowcase._id?.toString() || '';
        this.title = workShowcase.title;
        this.content = workShowcase.content;
        this.authorName = workShowcase.authorName;
        this.authorRole = workShowcase.authorRole;
        this.projectLocation = workShowcase.projectLocation;
        this.equipmentUsed = workShowcase.equipmentUsed;
        this.imageUrls = workShowcase.imageUrls || [];
        this.isActive = workShowcase.isActive;
        this.viewCount = workShowcase.viewCount;
        this.likeCount = workShowcase.likeCount;
        this.publishedAt = workShowcase.publishedAt;
        this.createdAt = workShowcase.createdAt;
        this.updatedAt = workShowcase.updatedAt;
    }
} 