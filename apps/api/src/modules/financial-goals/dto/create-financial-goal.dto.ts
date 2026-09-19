import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { GoalStatus } from '../entities/financial-goal.entity';

export class CreateFinancialGoalDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNotEmpty()
  @Min(0)
  targetAmountCents!: number;

  @IsOptional()
  @Min(0)
  currentAmountCents?: number;

  @IsOptional()
  @IsDateString()
  targetDate?: string | null;

  @IsOptional()
  @IsEnum(GoalStatus)
  status?: GoalStatus;
}
