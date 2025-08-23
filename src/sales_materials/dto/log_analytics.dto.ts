

export class LogAnalyticsDto {
    totalQueries: number;
    successfulQueries: number;
    failedQueries: number;
    successRate: number;
    averageResponseTime: number;
    averageMaterialsReturned: number;
    topQueries: Array<{ query: string; count: number }>;
    queryTrends: Array<{ date: string; count: number }>;
}