import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class AddEvents1691221094462 implements MigrationInterface {
  name = 'AddEvents1691221094462';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."event_language_enum" AS ENUM('ru', 'he', 'en')`,
    );
    await queryRunner.query(
      `CREATE TABLE "event" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "description" character varying NOT NULL, "startingAt" TIMESTAMP NOT NULL, "endingAt" TIMESTAMP NOT NULL, "price" integer, "detailsUrl" character varying NOT NULL, "city" character varying NOT NULL, "language" "public"."event_language_enum" NOT NULL, "eventSourceMessageId" character varying NOT NULL, "sourceId" uuid, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_d2c82c8bbf211f4b6f86f415024" FOREIGN KEY ("sourceId") REFERENCES "event_source"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event" DROP CONSTRAINT "FK_d2c82c8bbf211f4b6f86f415024"`,
    );
    await queryRunner.query(`DROP TABLE "event"`);
    await queryRunner.query(`DROP TYPE "public"."event_language_enum"`);
  }
}
