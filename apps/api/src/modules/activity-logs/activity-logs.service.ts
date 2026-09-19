import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from './activity-log.entity';

export interface LogActivityInput {
  userId: string;
  module: string;
  entity: string;
  entityId?: string | null;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  label: string;
  details?: string | null;
}

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly logs: Repository<ActivityLog>,
  ) {}

  async log(input: LogActivityInput): Promise<ActivityLog> {
    const log = this.logs.create({
      userId: input.userId,
      module: input.module,
      entity: input.entity,
      entityId: input.entityId ?? null,
      action: input.action,
      label: input.label,
      details: input.details ?? null,
    });

    return this.logs.save(log);
  }

  async listForUser(userId: string): Promise<ActivityLog[]> {
    return this.logs.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
