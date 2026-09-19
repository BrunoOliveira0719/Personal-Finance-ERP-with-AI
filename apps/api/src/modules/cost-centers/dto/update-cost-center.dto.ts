import { IsOptional, IsString } from 'class-validator';

export class UpdateCostCenterDto {
  @IsOptional()
  @IsString()
  name?: string;
}
