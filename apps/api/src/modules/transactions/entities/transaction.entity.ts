import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';
import { User } from '../../auth/entities/user.entity';

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  POSTED = 'POSTED',
  CANCELLED = 'CANCELLED',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;

  @Column('uuid')
  accountId!: string;

  @ManyToOne(() => Account, { onDelete: 'RESTRICT' })
  account!: Account;

  @Column({ type: 'uuid', nullable: true })
  categoryId!: string | null;

  @Column({ type: 'uuid', nullable: true })
  costCenterId!: string | null;

  @Column({ type: 'enum', enum: TransactionType })
  type!: TransactionType;

  @Column({ type: 'bigint' })
  amountCents!: string;

  @Column({ type: 'varchar', nullable: true })
  description!: string | null;

  @Column({ type: 'date' })
  transactionDate!: string;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.POSTED })
  status!: TransactionStatus;

  @Column({ type: 'uuid', nullable: true })
  transferPairId!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
