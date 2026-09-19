import { IsDateString, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';

export class CreateBudgetDto {
  @IsUUID()
  categoryId!: string;

  @IsDateString()
  periodMonth!: string;

  @IsNotEmpty()
  @Min(0)
  amountCents!: number;
}
