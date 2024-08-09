import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import jwtConfig from '../auth/config/jwt.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([User  ]) , forwardRef(() => AuthModule) ,  ConfigModule.forFeature(jwtConfig)],
  controllers: [UsersController],
  providers: [UsersService, PaginationService ], 
  exports: [UsersService],
})
export class UsersModule {}
