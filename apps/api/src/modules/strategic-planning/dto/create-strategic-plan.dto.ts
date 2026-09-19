import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StrategicPlanStatus } from '../entities/strategic-plan.entity';

export class CreateStrategicPlanDto {
  @IsString() @IsNotEmpty() name!: string;
  @IsOptional() @IsString() vision?: string | null;
  @IsDateString() horizonStart!: string;
  @IsDateString() horizonEnd!: string;
  @IsOptional() @IsEnum(StrategicPlanStatus) status?: StrategicPlanStatus;
}
