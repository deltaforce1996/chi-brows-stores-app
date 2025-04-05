import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { EmployeeEntity } from 'src/db/entities/emp.entity';
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
  entities: [EmployeeEntity],
  synchronize: true, // ❗ dev only
};
