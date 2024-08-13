import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { Book } from '../books/entities/book.entity';
import { User } from '../users/entities/user.entity';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '../auth/config/jwt.config';
import { UsersService } from '../users/users.service';
import { PaginationService } from '@root/src/core/pagination/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, Book, User]) ,  ConfigModule.forFeature(jwtConfig),
  AuthModule],
  providers: [SalesService , UsersService, PaginationService],
  controllers: [SalesController],
  exports:[SalesService]
})
export class SalesModule {}
