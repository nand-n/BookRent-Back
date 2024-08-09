import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from '@app/modules/health/health.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { SharedModule } from '../core/shared.module';
import { CoreModule } from './core.module';
import { AppConfigModule } from '../config/app.config.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

/** This is a TypeScript module that imports various modules and sets up a TypeORM connection using
configuration values obtained from a ConfigService. */
@Module({
  imports: [
    AppConfigModule,
    CoreModule,
    SharedModule,
    ThrottlerModule.forRoot(
      [
        {
          name: 'short',
          ttl: 1000,
          limit: 3,
        },
        {
          name: 'medium',
          ttl: 10000,
          limit: 20
        },
        {
          name: 'long',
          ttl: 60000,
          limit: 100
        }
      ]
    ),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../../", "uploads"),
      serveRoot: "/api/v1/uploads/",
      
    }),
    HealthModule,
  ],
})
export class AppModule {}
