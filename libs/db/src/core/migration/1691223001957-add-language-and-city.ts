import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class AddLanguageAndCity1691223001957 implements MigrationInterface {
  name = 'AddLanguageAndCity1691223001957';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_source" ADD "eventCity" character varying`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."event_source_eventlanguage_enum" AS ENUM('ru', 'he', 'en')`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_source" ADD "eventLanguage" "public"."event_source_eventlanguage_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_source" DROP COLUMN "eventLanguage"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."event_source_eventlanguage_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_source" DROP COLUMN "eventCity"`,
    );
  }
}
