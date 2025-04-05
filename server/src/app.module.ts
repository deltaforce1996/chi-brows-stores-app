import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { EmployeeModule } from './apis/employee/employee.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ✅ ไม่ต้อง import ซ้ำในโมดูลอื่น
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    EmployeeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
