import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { Sale } from './entities/sale.entity';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sales.dto';
import { MonthlySalesStatisticsDto } from './dto/monthly-sales-statistics.dto';
import { YearlySalesReportDto } from './dto/yearly-sales-report.dto';
import { MonthlyComparedSalesDto } from './dto/month-compare.dto';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  async createSale(@Body() saleData:  CreateSaleDto): Promise<Sale> {
    return this.salesService.createSale(saleData);
  }

  @Get('earnings-summary')
  async getEarningsSummary(): Promise<any> {
    return this.salesService.getEarningsSummary();
  }

  @Get('live-book-status')
  async getLiveBookStatus(): Promise<any> {
    return this.salesService.getLiveBookStatus();
  }
  @Get('monthly-statistics')
  async getMonthlyStatistics(): Promise<MonthlySalesStatisticsDto> {
    return this.salesService.getMonthlyStatistics();
  }
  @Get('yearly-report')
  async getYearlySalesReport(@Query('year') year: number): Promise<YearlySalesReportDto> {
    return this.salesService.getYearlySalesReport(year);
  }
  @Get('monthly-compared-statistics')
  async getMonthlySalesStatistics(): Promise<MonthlyComparedSalesDto> {
    return this.salesService.getMonthlyComparedSales();
  }
}
