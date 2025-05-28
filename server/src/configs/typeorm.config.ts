import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { CustEntity } from 'src/db/entities/cust.entity';
import { EmployeeEntity } from 'src/db/entities/emp.entity';
import { OrderItemEntity } from 'src/db/entities/order-item.entity';
import { OrderEntity } from 'src/db/entities/order.entity';
import { ProductEntity } from 'src/db/entities/product.entity';
import { UploadEntity } from 'src/db/entities/upload.entity';
// import { join } from 'path';

config(); // Load environment variables from .env file

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost', // Use env variable or default
  port: Number(process.env.DB_PORT) || 3306, // Use env variable or default
  username: process.env.DB_USER || 'root', // Use env variable or default
  password: process.env.DB_PASS || '', // Use env variable or default (consider security)
  database: process.env.DB_NAME || 'yourdb', // Use env variable or default
  // entities: [join(__dirname, '..', 'db', '**', '*.entity.{ts,js}')], // Alternative way to load entities
  entities: [
    EmployeeEntity,
    CustEntity,
    ProductEntity,
    OrderEntity,
    OrderItemEntity,
    UploadEntity,
  ], // Explicitly list entities
  synchronize: true, // ❗ IMPORTANT: Set to false in production and use migrations!
};

// Log the configuration object to the console
console.log('host:', process.env.DB_HOST || 'localhost ');
console.log('port:', Number(process.env.DB_PORT) || 3306);
console.log('username:', process.env.DB_USER || 'root');
console.log('password:', process.env.DB_PASS || '');
console.log('database:', process.env.DB_NAME || 'yourdb');
// console.log('TypeORM Configuration:', typeOrmConfig);
