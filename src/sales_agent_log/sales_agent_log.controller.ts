import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, ParseBoolPipe } from '@nestjs/common';
import { SalesAgentLogService } from './sales_agent_log.service';
import { CreateSalesAgentLogDto } from './dto/create-sales_agent_log.dto';
import { UpdateSalesAgentLogDto } from './dto/update-sales_agent_log.dto';


@Controller('sales-agent-log')
export class SalesAgentLogController {
  constructor(private readonly salesAgentLogService: SalesAgentLogService) {}

  @Post()
  create(@Body() createSalesAgentLogDto: CreateSalesAgentLogDto) {
    return this.salesAgentLogService.create(createSalesAgentLogDto);
  }

  @Get()
  findAll(
    @Query('vendorId') vendorId?: string,
    @Query('success', ParseBoolPipe) success?: boolean,
  ) {
    if (vendorId) {
      return this.salesAgentLogService.findByVendorId(vendorId);
    }
    if (typeof success === 'boolean') {
      return this.salesAgentLogService.findBySuccess(success);
    }
    return this.salesAgentLogService.findAll();
  }

  @Get('analytics')
  getAnalytics(@Query('vendorId') vendorId?: string) {
    return this.salesAgentLogService.getAnalytics(vendorId);
  }

  @Post('cleanup')
  cleanOldLogs(@Query('daysToKeep', ParseIntPipe) daysToKeep: number = 90) {
    return this.salesAgentLogService.cleanOldLogs(daysToKeep);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.salesAgentLogService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSalesAgentLogDto: UpdateSalesAgentLogDto,
  ) {
    return this.salesAgentLogService.update(id, updateSalesAgentLogDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.salesAgentLogService.remove(id);
  }
}