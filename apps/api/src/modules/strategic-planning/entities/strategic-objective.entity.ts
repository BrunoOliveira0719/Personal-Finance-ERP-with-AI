import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { StrategicPlan } from './strategic-plan.entity';

export enum ObjectivePerspective {
  FINANCIAL = 'FINANCIAL',
  SECURITY = 'SECURITY',
  GROWTH = 'GROWTH',
  QUALITY_OF_LIFE = 'QUALITY_OF_LIFE',
}

export enum StrategicObjectiveStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('strategic_objectives')
export class StrategicObjective {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column('uuid') userId!: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' }) user!: User;
  @Column('uuid') planId!: string;
  @ManyToOne(() => StrategicPlan, { onDelete: 'CASCADE' }) plan!: StrategicPlan;
  @Column() title!: string;
  @Column({ type: 'text', nullable: true }) description!: string | null;
  @Column({ type: 'enum', enum: ObjectivePerspective }) perspective!: ObjectivePerspective;
  @Column({ type: 'bigint', nullable: true }) targetValueCents!: string | null;
  @Column({ type: 'date', nullable: true }) targetDate!: string | null;
  @Column({ type: 'enum', enum: StrategicObjectiveStatus, default: StrategicObjectiveStatus.ACTIVE })
  status!: StrategicObjectiveStatus;
  @CreateDateColumn({ type: 'timestamptz' }) createdAt!: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updatedAt!: Date;
}
