// data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { EmployeeEntity } from './src/db/entities/emp.entity';
import { ProductEntity } from './src/db/entities/product.entity';

// โหลดค่าจาก .env
config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [EmployeeEntity, ProductEntity],
  migrations: ['src/db/migrations/*.{ts,js}'],
  synchronize: false,
  logging: true,
});
