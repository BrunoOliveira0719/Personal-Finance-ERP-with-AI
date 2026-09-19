import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStrategicPlanning1710000005000 implements MigrationInterface {
  name = 'CreateStrategicPlanning1710000005000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."strategic_plans_status_enum" AS ENUM('ACTIVE','COMPLETED','ARCHIVED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."strategic_objectives_perspective_enum" AS ENUM('FINANCIAL','SECURITY','GROWTH','QUALITY_OF_LIFE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."strategic_objectives_status_enum" AS ENUM('ACTIVE','COMPLETED','CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tactical_actions_status_enum" AS ENUM('PLANNED','IN_PROGRESS','DONE','CANCELLED')`,
    );
    await queryRunner.query(`
      CREATE TABLE "strategic_plans" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "userId" uuid NOT NULL,
        "name" character varying NOT NULL,
        "vision" text,
        "horizonStart" date NOT NULL,
        "horizonEnd" date NOT NULL,
        "status" "public"."strategic_plans_status_enum" NOT NULL DEFAULT 'ACTIVE',
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_strategic_plans_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_strategic_plans_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "strategic_objectives" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "userId" uuid NOT NULL,
        "planId" uuid NOT NULL,
        "title" character varying NOT NULL,
        "description" text,
        "perspective" "public"."strategic_objectives_perspective_enum" NOT NULL,
        "targetValueCents" bigint,
        "targetDate" date,
        "status" "public"."strategic_objectives_status_enum" NOT NULL DEFAULT 'ACTIVE',
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_strategic_objectives_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_strategic_objectives_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_strategic_objectives_plan" FOREIGN KEY ("planId") REFERENCES "strategic_plans"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "tactical_actions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "userId" uuid NOT NULL,
        "objectiveId" uuid NOT NULL,
        "title" character varying NOT NULL,
        "description" text,
        "dueDate" date,
        "estimatedAmountCents" bigint,
        "status" "public"."tactical_actions_status_enum" NOT NULL DEFAULT 'PLANNED',
        "createdAt" timestamptz NOT NULL DEFAULT now(),
        "updatedAt" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tactical_actions_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_tactical_actions_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_tactical_actions_objective" FOREIGN KEY ("objectiveId") REFERENCES "strategic_objectives"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      'CREATE INDEX "IDX_strategic_plans_user" ON "strategic_plans" ("userId")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_strategic_objectives_user_plan" ON "strategic_objectives" ("userId", "planId")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_tactical_actions_user_objective" ON "tactical_actions" ("userId", "objectiveId")',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_tactical_actions_user_objective"');
    await queryRunner.query('DROP INDEX "IDX_strategic_objectives_user_plan"');
    await queryRunner.query('DROP INDEX "IDX_strategic_plans_user"');
    await queryRunner.query('DROP TABLE "tactical_actions"');
    await queryRunner.query('DROP TABLE "strategic_objectives"');
    await queryRunner.query('DROP TABLE "strategic_plans"');
    await queryRunner.query('DROP TYPE "public"."tactical_actions_status_enum"');
    await queryRunner.query('DROP TYPE "public"."strategic_objectives_status_enum"');
    await queryRunner.query('DROP TYPE "public"."strategic_objectives_perspective_enum"');
    await queryRunner.query('DROP TYPE "public"."strategic_plans_status_enum"');
  }
}
