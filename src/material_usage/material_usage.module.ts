import { Module } from '@nestjs/common';
import { MaterialUsageService } from './material_usage.service';
import { MaterialUsageController } from './material_usage.controller';

@Module({
  controllers: [MaterialUsageController],
  providers: [MaterialUsageService],
})
export class MaterialUsageModule {}
