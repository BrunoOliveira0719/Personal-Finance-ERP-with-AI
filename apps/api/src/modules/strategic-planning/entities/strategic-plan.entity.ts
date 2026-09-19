import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum StrategicPlanStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

@Entity('strategic_plans')
export class StrategicPlan {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column('uuid') userId!: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' }) user!: User;
  @Column() name!: string;
  @Column({ type: 'text', nullable: true }) vision!: string | null;
  @Column({ type: 'date' }) horizonStart!: string;
  @Column({ type: 'date' }) horizonEnd!: string;
  @Column({ type: 'enum', enum: StrategicPlanStatus, default: StrategicPlanStatus.ACTIVE })
  status!: StrategicPlanStatus;
  @CreateDateColumn({ type: 'timestamptz' }) createdAt!: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updatedAt!: Date;
}
