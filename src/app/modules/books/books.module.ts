import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { Book } from './entities/book.entity';
import { User } from '../users/entities/user.entity';
import { Category } from '../catagory/entities/catagory.entity';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsForBooks } from '@root/src/core/utils/bookUploader';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '../auth/config/jwt.config';
import { UsersService } from '../users/users.service';
import { PaginationService } from '@root/src/core/pagination/pagination.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, User, Category]),
    MulterModule.register(multerOptionsForBooks),
    ConfigModule.forFeature(jwtConfig),
    AuthModule
  ],
  controllers: [BookController],
  providers: [BookService , UsersService , PaginationService ],
  exports: [BookService],
})
export class BookModule {}
