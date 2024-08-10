import { IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';

export class PublishBookDto {
    @IsNumberString({}, { message: 'bookQuantity must be a number' })
    @IsOptional()
    bookQuantity?: string;

    @IsString()
    @IsOptional()
    coverImageUrl?: string;

    @IsNumberString({}, { message: 'price must be a number' })
    @IsOptional()
    price?: string;
}
