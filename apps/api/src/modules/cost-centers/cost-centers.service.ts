import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCostCenterDto } from './dto/create-cost-center.dto';
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
}
