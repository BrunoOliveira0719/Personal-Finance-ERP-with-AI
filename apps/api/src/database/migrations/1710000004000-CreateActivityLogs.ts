import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateActivityLogs1710000004000 implements MigrationInterface {
  name = 'CreateActivityLogs1710000004000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."activity_logs_action_enum" AS ENUM('CREATE', 'UPDATE', 'DELETE')`,
    );

    await queryRunner.query(`
      CREATE TABLE "activity_logs" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "userId" uuid NOT NULL,
        "module" character varying NOT NULL,
        "entity" character varying NOT NULL,
        "entityId" uuid,
        "action" "public"."activity_logs_action_enum" NOT NULL,
        "label" character varying NOT NULL,
        "details" text,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_activity_logs_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_activity_logs_userId" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      'CREATE INDEX "IDX_activity_logs_userId_createdAt" ON "activity_logs" ("userId", "createdAt" DESC)',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_activity_logs_userId_createdAt"');
    await queryRunner.query('DROP TABLE "activity_logs"');
    await queryRunner.query('DROP TYPE "public"."activity_logs_action_enum"');
  }
}
