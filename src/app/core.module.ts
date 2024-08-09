import { Global, Module } from '@nestjs/common';

import { UsersModule } from './modules/users/users.module';
import { CategoryModule } from './modules/catagory/catagory.module';
import { BookModule } from './modules/books/books.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Global()
@Module({
  imports: [ UsersModule , CategoryModule , BookModule],

})
export class CoreModule {}

