import { IsString, IsArray, IsOptional, IsObject, MaxLength, IsUrl } from 'class-validator';

export class CreateSalesMaterialDto {
    @IsString()
    @MaxLength(100)
    productId: string;

    @IsString()
    @MaxLength(50)
    materialType: string;

    @IsString()
    @MaxLength(255)
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsUrl()
    @MaxLength(500)
    fileUrl: string;

    @IsString()
    @IsUrl()
    @IsOptional()
    @MaxLength(500)
    thumbnailUrl?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    tags?: string[];

    @IsArray()
    @IsOptional()
    embedding?: number[];

    @IsObject()
    @IsOptional()
    metadata?: Record<string, any>;
}
