import { Controller, Get, Post, Body, Query, UseGuards, Req } from '@nestjs/common';
import { Sale } from './entities/sale.entity';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sales.dto';
import { MonthlySalesStatisticsDto } from './dto/monthly-sales-statistics.dto';
import { YearlySalesReportDto } from './dto/yearly-sales-report.dto';
import { MonthlyComparedSalesDto } from './dto/month-compare.dto';
import { Roles } from '../auth/autherization/decorators/role.decorator';
import { Role } from '../users/enums/role.enum';
import { RolesGuard } from '../auth/autherization/guards/roles.guard';
import { REQUEST_USER } from '../auth/auth.constants';
import { User } from '../users/entities/user.entity';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  async createSale(@Body() saleData:  CreateSaleDto): Promise<Sale> {
    return this.salesService.createSale(saleData);
  }

  @Get('earnings-summary')
  @Roles(Role.Admin,Role.Regular, Role.SuperAdmin)
  @UseGuards(RolesGuard)
  async getEarningsSummary(@Req() req: Request): Promise<any> {
    const currentUser = req[REQUEST_USER] as User;
    return this.salesService.getEarningsSummary(currentUser);
  }

  @Get('live-book-status')
  async getLiveBookStatus(): Promise<any> {
    return this.salesService.getLiveBookStatus();
  }
  @Get('monthly-statistics')
  @Roles(Role.Admin,Role.Regular , Role.SuperAdmin)
  @UseGuards(RolesGuard)
  async getMonthlyStatistics(@Req() req: Request): Promise<MonthlySalesStatisticsDto> {
    const currentUser = req[REQUEST_USER] as User;
    return this.salesService.getMonthlyStatistics(currentUser);
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
