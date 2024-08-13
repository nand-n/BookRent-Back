import { IsNotEmpty, IsNumber, IsDateString, IsBoolean, IsString } from 'class-validator';

export class CreateSaleDto {
  @IsNotEmpty()
  @IsString()
  bookId: string;

  @IsNotEmpty()
  @IsString()
  buyerId: string;

  @IsNotEmpty()
  @IsNumber()
  salePrice: number;

  @IsNotEmpty()
  @IsDateString()
  saleDate: Date;

  @IsBoolean()
  isCompleted: boolean;
}
