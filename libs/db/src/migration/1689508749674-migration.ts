import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class Migration1689508749674 implements MigrationInterface {
  name = 'Migration1689508749674';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."event_source_type_enum" AS ENUM('telegram')`,
    );
    await queryRunner.query(
      `CREATE TABLE "event_source" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "uri" character varying NOT NULL, "type" "public"."event_source_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3ac063c4d7882981e9843b067d3" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "event_source"`);
    await queryRunner.query(`DROP TYPE "public"."event_source_type_enum"`);
  }
}
