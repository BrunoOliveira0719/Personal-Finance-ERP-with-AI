import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import {
  ObjectivePerspective,
  StrategicObjectiveStatus,
} from '../entities/strategic-objective.entity';

export class CreateStrategicObjectiveDto {
  @IsUUID() planId!: string;
  @IsString() @IsNotEmpty() title!: string;
  @IsOptional() @IsString() description?: string | null;
  @IsEnum(ObjectivePerspective) perspective!: ObjectivePerspective;
  @IsOptional() @Min(0) targetValueCents?: number | null;
  @IsOptional() @IsDateString() targetDate?: string | null;
  @IsOptional() @IsEnum(StrategicObjectiveStatus) status?: StrategicObjectiveStatus;
}
