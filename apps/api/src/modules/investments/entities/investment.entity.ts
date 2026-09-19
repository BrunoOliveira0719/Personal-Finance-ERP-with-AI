import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
@Entity('investments')
export class Investment {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column('uuid') userId!: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' }) user!: User;
  @Column() ticker!: string;
  @Column() type!: string;
  @Column({ type: 'decimal', precision: 20, scale: 8 }) quantity!: string;
  @Column({ type: 'bigint' }) avgPriceCents!: string;
  @Column({ type: 'bigint' }) investedAmountCents!: string;
  @Column({ type: 'bigint' }) currentValueCents!: string;
  @CreateDateColumn({ type: 'timestamptz' }) createdAt!: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updatedAt!: Date;
}
