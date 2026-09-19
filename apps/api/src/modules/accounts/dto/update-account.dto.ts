import { IsEnum, IsInt, IsOptional, IsString, Length } from 'class-validator';
import { AccountType } from '../entities/account.entity';

export class UpdateAccountDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(AccountType)
  type?: AccountType;

  @IsOptional()
  @IsString()
  institution?: string | null;

  @IsOptional()
  @IsInt()
  initialBalanceCents?: number;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;
}
