import { IsString, IsNumber, IsOptional, IsBoolean, MaxLength, Min } from 'class-validator';

export class CreateSalesAgentLogDto {
    @IsString()
    @MaxLength(100)
    vendorId: string;

    @IsString()
    query: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    materialsReturned?: number;

    @IsString()
    @IsOptional()
    responseSummary?: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    responseTimeMs?: number;

    @IsBoolean()
    @IsOptional()
    success?: boolean;
}