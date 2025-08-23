import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalesAgentLog } from './entities/sales_agent_log.entity';
import { CreateSalesAgentLogDto } from './dto/create-sales_agent_log.dto';
import { UpdateSalesAgentLogDto } from './dto/update-sales_agent_log.dto';
import { LogAnalyticsDto } from 'src/sales_materials/dto/log_analytics.dto';

@Injectable()
export class SalesAgentLogService {
  constructor(
    @InjectRepository(SalesAgentLog)
    private salesAgentLogRepository: Repository<SalesAgentLog>,
  ) {}

  async create(createSalesAgentLogDto: CreateSalesAgentLogDto): Promise<SalesAgentLog> {
    const salesAgentLog = this.salesAgentLogRepository.create(createSalesAgentLogDto);
    return await this.salesAgentLogRepository.save(salesAgentLog);
  }

  async findAll(): Promise<SalesAgentLog[]> {
    return await this.salesAgentLogRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<SalesAgentLog> {
    const log = await this.salesAgentLogRepository.findOne({ where: { id } });
    if (!log) {
      throw new Error(`SalesAgentLog with id ${id} not found`);
    }
    return log;
  }

  async findByVendorId(vendorId: string): Promise<SalesAgentLog[]> {
    return await this.salesAgentLogRepository.find({
      where: { vendorId },
      order: { createdAt: 'DESC' },
    });
  }

  async findBySuccess(success: boolean): Promise<SalesAgentLog[]> {
    return await this.salesAgentLogRepository.find({
      where: { success },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updateSalesAgentLogDto: UpdateSalesAgentLogDto): Promise<SalesAgentLog> {
    await this.salesAgentLogRepository.update(id, updateSalesAgentLogDto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.salesAgentLogRepository.delete(id);
  }

  // Método para obtener analytics del log
  async getAnalytics(vendorId?: string): Promise<LogAnalyticsDto> {
    let queryBuilder = this.salesAgentLogRepository.createQueryBuilder('log');

    if (vendorId) {
      queryBuilder = queryBuilder.where('log.vendorId = :vendorId', { vendorId });
    }

    const totalQueries = await queryBuilder.getCount();
    
    const successfulQueries = await queryBuilder
      .andWhere('log.success = true')
      .getCount();

    const failedQueries = totalQueries - successfulQueries;
    const successRate = totalQueries > 0 ? (successfulQueries / totalQueries) * 100 : 0;

    const avgResponseTime = await queryBuilder
      .select('AVG(log.responseTimeMs)', 'avg')
      .getRawOne();

    const avgMaterialsReturned = await queryBuilder
      .select('AVG(log.materialsReturned)', 'avg')
      .getRawOne();

    const topQueries = await queryBuilder
      .select('log.query', 'query')
      .addSelect('COUNT(*)', 'count')
      .groupBy('log.query')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    const queryTrends = await queryBuilder
      .select("DATE(log.createdAt)", 'date')
      .addSelect('COUNT(*)', 'count')
      .groupBy("DATE(log.createdAt)")
      .orderBy('date', 'DESC')
      .limit(30)
      .getRawMany();

    return {
      totalQueries,
      successfulQueries,
      failedQueries,
      successRate: Math.round(successRate * 100) / 100,
      averageResponseTime: Math.round((avgResponseTime?.avg || 0) * 100) / 100,
      averageMaterialsReturned: Math.round((avgMaterialsReturned?.avg || 0) * 100) / 100,
      topQueries: topQueries.map(item => ({
        query: item.query,
        count: parseInt(item.count)
      })),
      queryTrends: queryTrends.map(item => ({
        date: item.date,
        count: parseInt(item.count)
      }))
    };
  }

  // Método para limpiar logs antiguos
  async cleanOldLogs(daysToKeep: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.salesAgentLogRepository
      .createQueryBuilder()
      .delete()
      .where('createdAt < :cutoffDate', { cutoffDate })
      .execute();

    return result.affected || 0;
  }
}