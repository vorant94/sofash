import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class AddMeetupType1690544048029 implements MigrationInterface {
  name = 'AddMeetupType1690544048029';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."event_source_type_enum" RENAME TO "event_source_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."event_source_type_enum" AS ENUM('telegram', 'meetup')`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_source" ALTER COLUMN "type" TYPE "public"."event_source_type_enum" USING "type"::"text"::"public"."event_source_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."event_source_type_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."event_source_type_enum_old" AS ENUM('telegram')`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_source" ALTER COLUMN "type" TYPE "public"."event_source_type_enum_old" USING "type"::"text"::"public"."event_source_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."event_source_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."event_source_type_enum_old" RENAME TO "event_source_type_enum"`,
    );
  }
}
