export class YearlySalesReportDto {
    year: number;
    monthlySales: { month: string; totalSales: number }[];
  }
  