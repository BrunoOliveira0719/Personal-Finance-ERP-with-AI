import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { CreateCostCenterDto } from './dto/create-cost-center.dto';
import { UpdateCostCenterDto } from './dto/update-cost-center.dto';
import { CostCenter } from './entities/cost-center.entity';
@Injectable()
export class CostCentersService {
  constructor(
    @InjectRepository(CostCenter)
    private readonly costCenters: Repository<CostCenter>,
    private readonly activityLogs: ActivityLogsService,
  ) {}
  listForUser(userId: string) {
    return this.costCenters.find({ where: { userId }, order: { name: 'ASC' } });
  }
  async createForUser(userId: string, dto: CreateCostCenterDto) {
    const created = await this.costCenters.save(this.costCenters.create({ ...dto, userId }));
    await this.activityLogs.log({
      userId,
      module: 'cost-centers',
      entity: 'costCenter',
      entityId: created.id,
      action: 'CREATE',
      label: created.name,
      details: `Created cost center ${created.name}`,
    });
    return created;
  }

  async updateForUser(userId: string, costCenterId: string, dto: UpdateCostCenterDto) {
    const costCenter = await this.costCenters.findOne({ where: { id: costCenterId, userId } });
    if (!costCenter) throw new NotFoundException('Cost center not found');

    const previousName = costCenter.name;
    Object.assign(costCenter, {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
    });

    const updated = await this.costCenters.save(costCenter);
    await this.activityLogs.log({
      userId,
      module: 'cost-centers',
      entity: 'costCenter',
      entityId: updated.id,
      action: 'UPDATE',
      label: updated.name,
      details: `Updated cost center ${previousName}`,
    });
    return updated;
  }

  async deleteForUser(userId: string, costCenterId: string) {
    const costCenter = await this.costCenters.findOne({ where: { id: costCenterId, userId } });
    if (!costCenter) throw new NotFoundException('Cost center not found');
    await this.costCenters.remove(costCenter);
    await this.activityLogs.log({
      userId,
      module: 'cost-centers',
      entity: 'costCenter',
      entityId: costCenterId,
      action: 'DELETE',
      label: costCenter.name,
      details: `Deleted cost center ${costCenter.name}`,
    });
  }
}
