import { UserStatus } from 'src/utils/user-status.enum';
import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('customers')
export class CustEntity {
  @PrimaryColumn()
  id: string; // ex. CUST0001

  @Column()
  tel: string;

  @Column()
  line: string;

  @Column()
  facebook: string;

  @Column()
  fullname: string;

  @Column()
  nickname: string;

  @Column()
  address: string;

  @Column({ type: 'date' })
  birthday: Date;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;
}
