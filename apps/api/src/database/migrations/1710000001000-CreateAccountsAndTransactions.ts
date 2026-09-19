import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccountsAndTransactions1710000001000 implements MigrationInterface {
  name = 'CreateAccountsAndTransactions1710000001000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."accounts_type_enum" AS ENUM('CHECKING', 'SAVINGS', 'CASH', 'CREDIT_CARD', 'INVESTMENT')`,
    );
    await queryRunner.query(`
      CREATE TABLE "accounts" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "userId" uuid NOT NULL,
        "name" character varying NOT NULL,
        "type" "public"."accounts_type_enum" NOT NULL,
        "institution" character varying,
        "initialBalanceCents" bigint NOT NULL,
        "currency" character varying(3) NOT NULL DEFAULT 'BRL',
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_accounts_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_accounts_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query('CREATE INDEX "IDX_accounts_userId" ON "accounts" ("userId")');

    await queryRunner.query(
      `CREATE TYPE "public"."transactions_type_enum" AS ENUM('INCOME', 'EXPENSE', 'TRANSFER')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transactions_status_enum" AS ENUM('PENDING', 'POSTED', 'CANCELLED')`,
    );
    await queryRunner.query(`
      CREATE TABLE "transactions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "userId" uuid NOT NULL,
        "accountId" uuid NOT NULL,
        "categoryId" uuid,
        "costCenterId" uuid,
        "type" "public"."transactions_type_enum" NOT NULL,
        "amountCents" bigint NOT NULL,
        "description" character varying,
        "transactionDate" date NOT NULL,
        "status" "public"."transactions_status_enum" NOT NULL DEFAULT 'POSTED',
        "transferPairId" uuid,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_transactions_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_transactions_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_transactions_accountId" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT,
        CONSTRAINT "CHK_transactions_amountCents_positive" CHECK ("amountCents" > 0)
      )
    `);
    await queryRunner.query(
      'CREATE INDEX "IDX_transactions_userId_date" ON "transactions" ("userId", "transactionDate")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_transactions_accountId_date" ON "transactions" ("accountId", "transactionDate")',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_transactions_accountId_date"');
    await queryRunner.query('DROP INDEX "IDX_transactions_userId_date"');
    await queryRunner.query('DROP TABLE "transactions"');
    await queryRunner.query('DROP TYPE "public"."transactions_status_enum"');
    await queryRunner.query('DROP TYPE "public"."transactions_type_enum"');
    await queryRunner.query('DROP INDEX "IDX_accounts_userId"');
    await queryRunner.query('DROP TABLE "accounts"');
    await queryRunner.query('DROP TYPE "public"."accounts_type_enum"');
  }
}
