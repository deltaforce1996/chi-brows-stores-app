import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEntity } from 'src/db/entities/emp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeEntity])],
  providers: [EmployeeService],
  controllers: [EmployeeController],
})
export class EmployeeModule {}
