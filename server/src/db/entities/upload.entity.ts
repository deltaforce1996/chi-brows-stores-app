import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  // Index,
  UpdateDateColumn,
} from 'typeorm';

@Entity('uploads')
// @Index(['hash'], { unique: true })
export class UploadEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column()
  hash: string;

  @Column()
  path: string;

  @Column()
  owner_id: string;

  @Column()
  owner_type: 'employee' | 'customer' | 'order' | 'product';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
