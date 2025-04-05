import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class InitEmployeeSeed1743845555352 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const password = await bcrypt.hash('admin1234', 10);

    await queryRunner.query(`
      INSERT INTO employees (id, username, password, fullname, tel, birthday, email, created_at)
      VALUES (
        'EMP0001',
        'admin',
        '${password}',
        'System Admin',
        '0000000000',
        '1990-01-01',
        'admin@example.com',
        NOW()
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM employees WHERE id = 'EMP0001'`);
  }
}
