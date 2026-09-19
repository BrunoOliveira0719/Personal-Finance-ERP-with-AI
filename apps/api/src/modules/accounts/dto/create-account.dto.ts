import { IsEnum, IsInt, IsOptional, IsString, Length } from 'class-validator';
import { AccountType } from '../entities/account.entity';

export class CreateAccountDto {
  @IsString()
  name!: string;

  @IsEnum(AccountType)
  type!: AccountType;

  @IsOptional()
  @IsString()
  institution?: string;

  @IsInt()
  initialBalanceCents!: number;

  @IsOptional()
  @IsString()
  @Length(3, 3)
  currency?: string;
}
