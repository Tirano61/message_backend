import { PartialType } from '@nestjs/mapped-types';
import { CreateMaterialUsageDto } from './create-material_usage.dto';

export class UpdateMaterialUsageDto extends PartialType(CreateMaterialUsageDto) {}
