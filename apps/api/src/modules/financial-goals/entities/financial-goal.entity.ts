import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
export enum GoalStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
@Entity('financial_goals')
export class FinancialGoal {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column('uuid') userId!: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' }) user!: User;
  @Column() name!: string;
  @Column({ type: 'bigint' }) targetAmountCents!: string;
  @Column({ type: 'bigint', default: 0 }) currentAmountCents!: string;
  @Column({ type: 'date', nullable: true }) targetDate!: string | null;
  @Column({ type: 'enum', enum: GoalStatus, default: GoalStatus.ACTIVE }) status!: GoalStatus;
  @CreateDateColumn({ type: 'timestamptz' }) createdAt!: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updatedAt!: Date;
}
