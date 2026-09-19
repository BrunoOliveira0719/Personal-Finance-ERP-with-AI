import { PartialType } from '@nestjs/swagger';
import { CreateStrategicPlanDto } from './create-strategic-plan.dto';

export class UpdateStrategicPlanDto extends PartialType(CreateStrategicPlanDto) {}
