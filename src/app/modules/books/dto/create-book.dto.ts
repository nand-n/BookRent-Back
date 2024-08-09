import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  authorName: string;

  @IsNotEmpty()
  @IsUUID()
  categoryId: string;
  
  @IsOptional()
  @IsString()
  coverImageUrl: string;
  @IsOptional()
  @IsString()
  pdfUrl: string;

  @IsOptional()
  @IsInt()
  bookQuantity: number;

  @IsOptional()
  @IsInt()
  rentPricePerWeek: number;

  @IsInt()
  bookNumber:number
}
