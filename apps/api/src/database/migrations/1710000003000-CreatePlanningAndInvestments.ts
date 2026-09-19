import { MigrationInterface, QueryRunner } from 'typeorm';
export class CreatePlanningAndInvestments1710000003000 implements MigrationInterface {
  name = 'CreatePlanningAndInvestments1710000003000';
  async up(q: QueryRunner): Promise<void> {
    await q.query(
      `CREATE TYPE "public"."financial_goals_status_enum" AS ENUM('ACTIVE','COMPLETED','CANCELLED')`,
    );
    await q.query(
      `CREATE TABLE "budgets" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "userId" uuid NOT NULL, "categoryId" uuid NOT NULL, "periodMonth" date NOT NULL, "amountCents" bigint NOT NULL, "createdAt" timestamptz NOT NULL DEFAULT now(), "updatedAt" timestamptz NOT NULL DEFAULT now(), CONSTRAINT "PK_budgets_id" PRIMARY KEY ("id"), CONSTRAINT "FK_budgets_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE, CONSTRAINT "FK_budgets_category" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE)`,
    );
    await q.query(
      `CREATE TABLE "financial_goals" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "userId" uuid NOT NULL, "name" character varying NOT NULL, "targetAmountCents" bigint NOT NULL, "currentAmountCents" bigint NOT NULL DEFAULT 0, "targetDate" date, "status" "public"."financial_goals_status_enum" NOT NULL DEFAULT 'ACTIVE', "createdAt" timestamptz NOT NULL DEFAULT now(), "updatedAt" timestamptz NOT NULL DEFAULT now(), CONSTRAINT "PK_goals_id" PRIMARY KEY ("id"), CONSTRAINT "FK_goals_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE)`,
    );
    await q.query(
      `CREATE TABLE "investments" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "userId" uuid NOT NULL, "ticker" character varying NOT NULL, "type" character varying NOT NULL, "quantity" decimal(20,8) NOT NULL, "avgPriceCents" bigint NOT NULL, "investedAmountCents" bigint NOT NULL, "currentValueCents" bigint NOT NULL, "createdAt" timestamptz NOT NULL DEFAULT now(), "updatedAt" timestamptz NOT NULL DEFAULT now(), CONSTRAINT "PK_investments_id" PRIMARY KEY ("id"), CONSTRAINT "FK_investments_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE)`,
    );
    await q.query('CREATE INDEX "IDX_budgets_user_period" ON "budgets" ("userId", "periodMonth")');
    await q.query('CREATE INDEX "IDX_goals_user" ON "financial_goals" ("userId")');
    await q.query('CREATE INDEX "IDX_investments_user" ON "investments" ("userId")');
  }
  async down(q: QueryRunner): Promise<void> {
    await q.query('DROP INDEX "IDX_investments_user"');
    await q.query('DROP INDEX "IDX_goals_user"');
    await q.query('DROP INDEX "IDX_budgets_user_period"');
    await q.query('DROP TABLE "investments"');
    await q.query('DROP TABLE "financial_goals"');
    await q.query('DROP TABLE "budgets"');
    await q.query('DROP TYPE "public"."financial_goals_status_enum"');
  }
}
