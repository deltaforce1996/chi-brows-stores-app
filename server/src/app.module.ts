import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { EmployeeModule } from './apis/employee/employee.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './apis/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ✅ ไม่ต้อง import ซ้ำในโมดูลอื่น
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    EmployeeModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
