import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-catagory.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
