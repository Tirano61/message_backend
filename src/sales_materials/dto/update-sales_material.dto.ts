import { PartialType } from '@nestjs/mapped-types';
import { CreateSalesMaterialDto } from './create-sales_material.dto';

export class UpdateSalesMaterialDto extends PartialType(CreateSalesMaterialDto) {}
