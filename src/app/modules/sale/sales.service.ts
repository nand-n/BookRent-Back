import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from './entities/sale.entity';
import { CreateSaleDto } from './dto/create-sales.dto';
import { MonthlySalesStatisticsDto } from './dto/monthly-sales-statistics.dto';
import { endOfMonth, startOfMonth, subMonths , format } from 'date-fns';
import { YearlySalesReportDto } from './dto/yearly-sales-report.dto';
import { MonthlyComparedSalesDto } from './dto/month-compare.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
  ) {}

  async createSale(saleData: CreateSaleDto): Promise<Sale> {
    const { bookId, buyerId, salePrice, saleDate, isCompleted } = saleData;
  
    await this.saleRepository
      .createQueryBuilder()
      .insert()
      .into(Sale)
      .values({
        book: { id: bookId },  
        buyer: { id: buyerId }, 
        salePrice,
        saleDate,
        isCompleted,
      })
      .execute();
  
    return this.saleRepository
      .createQueryBuilder('sale')
      .where('sale.bookId = :bookId', { bookId })
      .andWhere('sale.buyerId = :buyerId', { buyerId })
      .andWhere('sale.saleDate = :saleDate', { saleDate })
      .getOne();
  }

  async getEarningsSummary(currentUser: User): Promise<any> {
    const isOwner = currentUser.role === 'owner';
  
    const earningsQuery = this.saleRepository.createQueryBuilder('sale')
      .select("DATE_TRUNC('month', sale.saleDate)", 'month')
      .addSelect('SUM(sale.salePrice)', 'total')
      .where('sale.isCompleted = :isCompleted', { isCompleted: true });
  
    if (isOwner) {
      earningsQuery
        .leftJoin('sale.book', 'book')
        .andWhere('book.ownerId = :userId', { userId: currentUser.id });
    }
  
    const earnings = await earningsQuery
      .groupBy("month")
      .orderBy('month', 'ASC')
      .getRawMany();
  
    return earnings.map(earning => ({
      month: earning.month,
      total: Number(earning.total),
    }));
  }
  
  

  async getMonthlyStatistics(currentUser: User): Promise<MonthlySalesStatisticsDto> {
    const currentDate = new Date();
    const currentMonthStart = startOfMonth(currentDate);
    const currentMonthEnd = endOfMonth(currentDate);
    const previousMonthStart = startOfMonth(subMonths(currentDate, 1));
    const previousMonthEnd = endOfMonth(subMonths(currentDate, 1));
  
    const isAdmin = currentUser.role === 'admin' || currentUser.role === 'super-admin';
  
    // Base query for current month's income
    const currentMonthQuery = this.saleRepository
      .createQueryBuilder('sale')
      .select('SUM(sale.salePrice)', 'sum')
      .where('sale.saleDate BETWEEN :start AND :end', {
        start: currentMonthStart,
        end: currentMonthEnd,
      })
      .andWhere('sale.isCompleted = :isCompleted', { isCompleted: true });
  
    // Base query for previous month's income
    const previousMonthQuery = this.saleRepository
      .createQueryBuilder('sale')
      .select('SUM(sale.salePrice)', 'sum')
      .where('sale.saleDate BETWEEN :start AND :end', {
        start: previousMonthStart,
        end: previousMonthEnd,
      })
      .andWhere('sale.isCompleted = :isCompleted', { isCompleted: true });
  
    // Base query for total income
    const totalIncomeQuery = this.saleRepository
      .createQueryBuilder('sale')
      .select('SUM(sale.salePrice)', 'sum')
      .where('sale.isCompleted = :isCompleted', { isCompleted: true });
  
    if (!isAdmin) {
      currentMonthQuery
        .leftJoin('sale.book', 'book')
        .andWhere('book.ownerId = :userId', { userId: currentUser.id });
  
      previousMonthQuery
        .leftJoin('sale.book', 'book')
        .andWhere('book.ownerId = :userId', { userId: currentUser.id });
  
      totalIncomeQuery
        .leftJoin('sale.book', 'book')
        .andWhere('book.ownerId = :userId', { userId: currentUser.id });
    }
  
    // Run all queries concurrently
    const [currentMonthIncome, previousMonthIncome, totalIncomeResult] = await Promise.all([
      currentMonthQuery.getRawOne(),
      previousMonthQuery.getRawOne(),
      totalIncomeQuery.getRawOne(),
    ]);
  
    const currentIncome = parseFloat(currentMonthIncome.sum) || 0;
    const previousIncome = parseFloat(previousMonthIncome.sum) || 0;
    const totalIncomeValue = parseFloat(totalIncomeResult.sum) || 0;
  
    // Calculate percentage change
    const percentageChange =
      previousIncome !== 0
        ? ((currentIncome - previousIncome) / previousIncome) * 100
        : currentIncome !== 0
        ? 100
        : 0;
  
    return {
      currentMonthIncome: currentIncome,
      previousMonthIncome: previousIncome,
      percentageChange,
      totalIncome: totalIncomeValue,
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
