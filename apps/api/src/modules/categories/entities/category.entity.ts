import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum CategoryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  INVESTMENT = 'INVESTMENT',
}

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column('uuid', { nullable: true }) userId!: string | null;
  @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: true }) user!: User | null;
  @Column() name!: string;
  @Column({ type: 'enum', enum: CategoryType }) type!: CategoryType;
  @Column('uuid', { nullable: true }) parentId!: string | null;
  @Column({ default: false }) isSystem!: boolean;
  @CreateDateColumn({ type: 'timestamptz' }) createdAt!: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updatedAt!: Date;
}
