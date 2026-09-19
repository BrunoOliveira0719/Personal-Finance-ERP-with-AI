import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategoriesAndCostCenters1710000002000 implements MigrationInterface {
  name = 'CreateCategoriesAndCostCenters1710000002000';
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."categories_type_enum" AS ENUM('INCOME', 'EXPENSE', 'INVESTMENT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "userId" uuid, "name" character varying NOT NULL, "type" "public"."categories_type_enum" NOT NULL, "parentId" uuid, "isSystem" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_categories_id" PRIMARY KEY ("id"), CONSTRAINT "FK_categories_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE)`,
    );
    await queryRunner.query('CREATE INDEX "IDX_categories_userId" ON "categories" ("userId")');
    await queryRunner.query(
      `CREATE TABLE "cost_centers" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "userId" uuid NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_cost_centers_id" PRIMARY KEY ("id"), CONSTRAINT "FK_cost_centers_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE)`,
    );
    await queryRunner.query('CREATE INDEX "IDX_cost_centers_userId" ON "cost_centers" ("userId")');
    await queryRunner.query(
      'ALTER TABLE "transactions" ADD CONSTRAINT "FK_transactions_categoryId" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL',
    );
    await queryRunner.query(
      'ALTER TABLE "transactions" ADD CONSTRAINT "FK_transactions_costCenterId" FOREIGN KEY ("costCenterId") REFERENCES "cost_centers"("id") ON DELETE SET NULL',
    );
  }
  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "transactions" DROP CONSTRAINT "FK_transactions_costCenterId"',
    );
    await queryRunner.query(
      'ALTER TABLE "transactions" DROP CONSTRAINT "FK_transactions_categoryId"',
    );
    await queryRunner.query('DROP INDEX "IDX_cost_centers_userId"');
    await queryRunner.query('DROP TABLE "cost_centers"');
    await queryRunner.query('DROP INDEX "IDX_categories_userId"');
    await queryRunner.query('DROP TABLE "categories"');
    await queryRunner.query('DROP TYPE "public"."categories_type_enum"');
  }
}
