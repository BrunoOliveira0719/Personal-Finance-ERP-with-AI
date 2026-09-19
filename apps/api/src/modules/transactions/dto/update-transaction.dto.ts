import { IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { TransactionStatus, TransactionType } from '../entities/transaction.entity';

export class UpdateTransactionDto {
  @IsOptional()
  @IsUUID()
  accountId?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string | null;

  @IsOptional()
  @IsUUID()
  costCenterId?: string | null;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsInt()
  @Min(1)
  amountCents?: number;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsDateString()
  transactionDate?: string;

  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @IsOptional()
  @IsUUID()
  transferPairId?: string | null;
}
