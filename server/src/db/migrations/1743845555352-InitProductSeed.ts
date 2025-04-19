import { MigrationInterface, QueryRunner } from 'typeorm';

// ตั้งชื่อคลาสให้สื่อความหมายและตรงกับชื่อไฟล์ (อาจปรับ timestamp ได้)
export class InitProductSeed1743845555352 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // เพิ่มข้อมูลสินค้าตัวอย่าง
    await queryRunner.query(`
      INSERT INTO products (id, name, price, description, image, created_at)
      VALUES
        (
          'P0001',
          'Product A',
          199.99,
          'Description for Product A',
          'images/product_a.jpg',
          NOW()
        ),
        (
          'P0002',
          'Product B',
          25.50,
          'Description for Product B',
          'images/product_b.png',
          NOW()
        ),
        (
          'P0003',
          'Product C (No Desc)',
          500.00,
          NULL, -- ตัวอย่างสินค้าที่ไม่มี description
          NULL, -- ตัวอย่างสินค้าที่ไม่มี image
          NOW()
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // ลบข้อมูลสินค้าที่เพิ่มเข้าไปในเมธอด up
    await queryRunner.query(
      `DELETE FROM products WHERE id IN ('P0001', 'P0002', 'P0003')`,
    );
  }
}
