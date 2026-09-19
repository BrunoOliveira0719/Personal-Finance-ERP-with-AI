import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  userId!: string;

  @Column()
  module!: string;

  @Column()
  entity!: string;

  @Column({ type: 'uuid', nullable: true })
  entityId!: string | null;

  @Column()
  action!: 'CREATE' | 'UPDATE' | 'DELETE';

  @Column()
  label!: string;

  @Column({ type: 'text', nullable: true })
  details!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
