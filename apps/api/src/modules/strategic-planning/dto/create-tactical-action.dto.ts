import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { TacticalActionStatus } from '../entities/tactical-action.entity';

export class CreateTacticalActionDto {
  @IsUUID() objectiveId!: string;
  @IsString() @IsNotEmpty() title!: string;
  @IsOptional() @IsString() description?: string | null;
  @IsOptional() @IsDateString() dueDate?: string | null;
  @IsOptional() @Min(0) estimatedAmountCents?: number | null;
  @IsOptional() @IsEnum(TacticalActionStatus) status?: TacticalActionStatus;
}
