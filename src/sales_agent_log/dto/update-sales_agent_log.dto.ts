import { PartialType } from '@nestjs/mapped-types';
import { CreateSalesAgentLogDto } from './create-sales_agent_log.dto';


export class UpdateSalesAgentLogDto extends PartialType(CreateSalesAgentLogDto) {}
