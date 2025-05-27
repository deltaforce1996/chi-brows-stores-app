import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { EmployeeModule } from './apis/employee/employee.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './apis/auth/auth.module';
import { CustomerModule } from './apis/customer/customer.module';
import { ProductModule } from './apis/product/product.module';
import { OrderModule } from './apis/order/order.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { LogViewerModule } from './apis/log-viewer/log-viewer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    EmployeeModule,
    CustomerModule,
    ProductModule,
    AuthModule,
    OrderModule,
    LogViewerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude(
        { path: 'logs', method: RequestMethod.ALL }, // GET /logs
        { path: 'logs/api', method: RequestMethod.ALL }, // GET /logs/api?...
        { path: 'logs/(.*)', method: RequestMethod.ALL }, // catch all under /logs/*
      )
      .forRoutes('*');
  }
}
