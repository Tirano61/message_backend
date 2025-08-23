import { IsString, IsNumber, IsOptional, IsObject, MaxLength } from 'class-validator';

export class CreateMaterialUsageDto {
    @IsString()
    @MaxLength(100)
    vendorId: string;

    @IsNumber()
    @IsOptional()
    materialId?: number;

    @IsString()
    @MaxLength(50)
    action: string;

    @IsObject()
    @IsOptional()
    clientInfo?: Record<string, any>;

    @IsString()
    @IsOptional()
    context?: string;
}