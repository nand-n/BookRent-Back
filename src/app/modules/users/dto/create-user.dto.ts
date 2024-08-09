import { IsEmail, IsString, IsOptional, IsEnum, IsArray } from 'class-validator';
import { Role } from '../enums/role.enum';
import { Permission, PermissionType } from '../../auth/autherization/permission.type';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  telegramUser?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role = Role.Regular;

  @IsArray()
  @IsEnum(Permission, { each: true })
  @IsOptional()
  permissions?: PermissionType[] = [];
}
