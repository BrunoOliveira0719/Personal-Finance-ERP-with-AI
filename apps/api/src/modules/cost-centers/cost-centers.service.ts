import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCostCenterDto } from './dto/create-cost-center.dto';
import { UpdateCostCenterDto } from './dto/update-cost-center.dto';
import { CostCenter } from './entities/cost-center.entity';
@Injectable()
export class CostCentersService {
  constructor(@InjectRepository(CostCenter) private readonly costCenters: Repository<CostCenter>) {}
  listForUser(userId: string) {
    return this.costCenters.find({ where: { userId }, order: { name: 'ASC' } });
  }
  createForUser(userId: string, dto: CreateCostCenterDto) {
    return this.costCenters.save(this.costCenters.create({ ...dto, userId }));
  }

  async updateForUser(userId: string, costCenterId: string, dto: UpdateCostCenterDto) {
    const costCenter = await this.costCenters.findOne({ where: { id: costCenterId, userId } });
    if (!costCenter) throw new NotFoundException('Cost center not found');

    Object.assign(costCenter, {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
    });

    return this.costCenters.save(costCenter);
  }

  async deleteForUser(userId: string, costCenterId: string) {
    const costCenter = await this.costCenters.findOne({ where: { id: costCenterId, userId } });
    if (!costCenter) throw new NotFoundException('Cost center not found');
    await this.costCenters.remove(costCenter);
  }
}
