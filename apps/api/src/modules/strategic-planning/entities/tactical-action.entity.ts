import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { StrategicObjective } from './strategic-objective.entity';

export enum TacticalActionStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
}

@Entity('tactical_actions')
export class TacticalAction {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column('uuid') userId!: string;
  @ManyToOne(() => User, { onDelete: 'CASCADE' }) user!: User;
  @Column('uuid') objectiveId!: string;
  @ManyToOne(() => StrategicObjective, { onDelete: 'CASCADE' }) objective!: StrategicObjective;
  @Column() title!: string;
  @Column({ type: 'text', nullable: true }) description!: string | null;
  @Column({ type: 'date', nullable: true }) dueDate!: string | null;
  @Column({ type: 'bigint', nullable: true }) estimatedAmountCents!: string | null;
  @Column({ type: 'enum', enum: TacticalActionStatus, default: TacticalActionStatus.PLANNED })
  status!: TacticalActionStatus;
  @CreateDateColumn({ type: 'timestamptz' }) createdAt!: Date;
  @UpdateDateColumn({ type: 'timestamptz' }) updatedAt!: Date;
}
