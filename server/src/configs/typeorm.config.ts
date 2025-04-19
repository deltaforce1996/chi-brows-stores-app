import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { CustEntity } from 'src/db/entities/cust.entity';
import { EmployeeEntity } from 'src/db/entities/emp.entity';
import { ProductEntity } from 'src/db/entities/product.entity';
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
  entities: [EmployeeEntity, CustEntity, ProductEntity], // Explicitly list entities
  synchronize: true, // ❗ IMPORTANT: Set to false in production and use migrations!
};

// Log the configuration object to the console
console.log('TypeORM Configuration:', typeOrmConfig);
