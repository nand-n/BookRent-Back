import { IsNotEmpty, IsNumber, IsDateString, IsBoolean } from 'class-validator';

export class CreateSaleDto {
  @IsNotEmpty()
  @IsNumber()
  bookId: number;

  @IsNotEmpty()
  @IsNumber()
  buyerId: number;

  @IsNotEmpty()
  @IsNumber()
  salePrice: number;

  @IsNotEmpty()
  @IsDateString()
  saleDate: Date;

  @IsBoolean()
  isCompleted: boolean;
}
