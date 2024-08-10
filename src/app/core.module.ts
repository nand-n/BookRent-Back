import { Global, Module } from '@nestjs/common';

import { UsersModule } from './modules/users/users.module';
import { CategoryModule } from './modules/catagory/catagory.module';
import { BookModule } from './modules/books/books.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SalesModule } from './modules/sale/sales.module';


@Global()
@Module({
  imports: [ UsersModule , CategoryModule , BookModule , SalesModule],

})
export class CoreModule {}

