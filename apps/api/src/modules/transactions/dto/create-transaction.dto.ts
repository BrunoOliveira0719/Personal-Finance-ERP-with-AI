import { IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { TransactionStatus, TransactionType } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @IsUUID()
  accountId!: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  costCenterId?: string;

  @IsEnum(TransactionType)
  type!: TransactionType;

  @IsInt()
  @Min(1)
  amountCents!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  transactionDate!: string;

  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @IsOptional()
  @IsUUID()
  transferPairId?: string;
}
