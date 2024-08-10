import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { CreateSaleDto } from './dto/create-sales.dto';
import { MonthlySalesStatisticsDto } from './dto/monthly-sales-statistics.dto';
import { endOfMonth, startOfMonth, subMonths , format } from 'date-fns';
import { YearlySalesReportDto } from './dto/yearly-sales-report.dto';
import { MonthlyComparedSalesDto } from './dto/month-compare.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
  ) {}

  async createSale(saleData:  CreateSaleDto): Promise<Sale> {
    const sale = this.saleRepository.create(saleData);
    return this.saleRepository.save(sale);
  }

  async getEarningsSummary(): Promise<any> {
    const earnings = await this.saleRepository.createQueryBuilder('sale')
      .select("DATE_TRUNC('month', sale.saleDate)", 'month')
      .addSelect('SUM(sale.salePrice)', 'total')
      .where('sale.isCompleted = :isCompleted', { isCompleted: true })
      .groupBy("month")
      .orderBy('month', 'ASC')
      .getRawMany();

    return earnings.map(earning => ({
      month: earning.month,
      total: Number(earning.total),
    }));
  }

  async getMonthlyStatistics(): Promise<MonthlySalesStatisticsDto> {
    const currentDate = new Date();
    const currentMonthStart = startOfMonth(currentDate);
    const currentMonthEnd = endOfMonth(currentDate);
    const previousMonthStart = startOfMonth(subMonths(currentDate, 1));
    const previousMonthEnd = endOfMonth(subMonths(currentDate, 1));

    const currentMonthIncome = await this.saleRepository
      .createQueryBuilder('sale')
      .where('sale.saleDate BETWEEN :start AND :end', {
        start: currentMonthStart,
        end: currentMonthEnd,
      })
      .andWhere('sale.isCompleted = :isCompleted', { isCompleted: true })
      .select('SUM(sale.salePrice)', 'sum')
      .getRawOne();

    const previousMonthIncome = await this.saleRepository
      .createQueryBuilder('sale')
      .where('sale.saleDate BETWEEN :start AND :end', {
        start: previousMonthStart,
        end: previousMonthEnd,
      })
      .andWhere('sale.isCompleted = :isCompleted', { isCompleted: true })
      .select('SUM(sale.salePrice)', 'sum')
      .getRawOne();

    const currentIncome = parseFloat(currentMonthIncome.sum) || 0;
    const previousIncome = parseFloat(previousMonthIncome.sum) || 0;

    const percentageChange =
      previousIncome !== 0
        ? ((currentIncome - previousIncome) / previousIncome) * 100
        : 0;

    return {
      currentMonthIncome: currentIncome,
      previousMonthIncome: previousIncome,
      percentageChange,
    };
  }

  async getMonthlyComparedSales(): Promise<MonthlyComparedSalesDto> {
    const currentDate = new Date();

    // Current month range
    const currentMonthStart = startOfMonth(currentDate);
    const currentMonthEnd = endOfMonth(currentDate);

    // Previous month range
    const previousMonthStart = startOfMonth(subMonths(currentDate, 1));
    const previousMonthEnd = endOfMonth(subMonths(currentDate, 1));

    const currentMonthIncome = await this.saleRepository
      .createQueryBuilder('sale')
      .where('sale.saleDate BETWEEN :start AND :end', {
        start: currentMonthStart,
        end: currentMonthEnd,
      })
      .andWhere('sale.isCompleted = :isCompleted', { isCompleted: true })
      .select('SUM(sale.salePrice)', 'sum')
      .getRawOne();

    const previousMonthIncome = await this.saleRepository
      .createQueryBuilder('sale')
      .where('sale.saleDate BETWEEN :start AND :end', {
        start: previousMonthStart,
        end: previousMonthEnd,
      })
      .andWhere('sale.isCompleted = :isCompleted', { isCompleted: true })
      .select('SUM(sale.salePrice)', 'sum')
      .getRawOne();

    const currentIncome = parseFloat(currentMonthIncome.sum) || 0;
    const previousIncome = parseFloat(previousMonthIncome.sum) || 0;

    const percentageChange =
      previousIncome !== 0
        ? ((currentIncome - previousIncome) / previousIncome) * 100
        : 0;

    return {
      currentMonthIncome: currentIncome,
      previousMonthIncome: previousIncome,
      percentageChange,
    };
  }

  async getYearlySalesReport(year: number): Promise<YearlySalesReportDto> {
    const sales = await this.saleRepository
      .createQueryBuilder('sale')
      .select("DATE_TRUNC('month', sale.saleDate) as month")
      .addSelect('SUM(sale.salePrice)', 'total')
      .where('EXTRACT(YEAR FROM sale.saleDate) = :year', { year })
      .andWhere('sale.isCompleted = :isCompleted', { isCompleted: true })
      .groupBy("DATE_TRUNC('month', sale.saleDate)")
      .orderBy("DATE_TRUNC('month', sale.saleDate)", 'ASC')
      .getRawMany();

    const monthlySales = sales.map(sale => ({
      month: format(new Date(sale.month), 'MMM'),
      totalSales: parseFloat(sale.total),
    }));

    return {
      year,
      monthlySales,
    };
  }

  async getLiveBookStatus(): Promise<any> {
    return await this.saleRepository.find({
      relations: ['book'],
    });
  }
}
