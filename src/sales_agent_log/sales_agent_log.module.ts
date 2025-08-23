import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesAgentLog } from './entities/sales_agent_log.entity';
import { SalesAgentLogController } from './sales_agent_log.controller';
import { SalesAgentLogService } from './sales_agent_log.service';

@Module({
  imports: [TypeOrmModule.forFeature([SalesAgentLog])],
  controllers: [SalesAgentLogController],
  providers: [SalesAgentLogService],
  exports: [SalesAgentLogService],
})
export class SalesAgentLogModule {}