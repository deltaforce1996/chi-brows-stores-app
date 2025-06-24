// src/db/entities/employee.entity.ts
import { UserStatus } from 'src/utils/user-status.enum';
import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity('employees')
export class EmployeeEntity {
  @PrimaryColumn()
  id: string; // ex. EMP0001

  @Column()
  tel: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  fullname: string;

  @Column({ type: 'date' })
  birthday: Date;

  @Column({ unique: true, nullable: true })
  email?: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;
}
