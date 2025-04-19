import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { CustEntity } from 'src/db/entities/cust.entity';
import { EmployeeEntity } from 'src/db/entities/emp.entity';
import { ProductEntity } from 'src/db/entities/product.entity';
// import { join } from 'path';

config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'yourdb',
  // entities: [join(__dirname, '..', 'db', '**', '*.entity.{ts,js}')],
  entities: [EmployeeEntity, CustEntity, ProductEntity],
  synchronize: true, // ❗ dev only
};
