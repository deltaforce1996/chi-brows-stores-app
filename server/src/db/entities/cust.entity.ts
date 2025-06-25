import { UserStatus } from 'src/utils/user-status.enum';
import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('customers')
export class CustEntity {
  @PrimaryColumn()
  id: string; // ex. CUST0001

  @Column({ type: 'varchar', nullable: true, default: null })
  tel: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  line: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  facebook: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  fullname: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  nickname: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  address: string;

  @Column({ type: 'date', nullable: true, default: null })
  birthday: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;
}
