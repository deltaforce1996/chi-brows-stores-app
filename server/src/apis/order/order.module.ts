import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderEntity } from 'src/db/entities/order.entity';
import { CustEntity } from 'src/db/entities/cust.entity';
import { EmployeeEntity } from 'src/db/entities/emp.entity';
import { ProductEntity } from 'src/db/entities/product.entity';
import { OrderItemEntity } from 'src/db/entities/order-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from '../customer/customer.module';
import { CustomerService } from '../customer/customer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      CustEntity,
      EmployeeEntity,
      ProductEntity,
      OrderItemEntity,
    ]),
    CustomerModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, CustomerService],
})
export class OrderModule {}
