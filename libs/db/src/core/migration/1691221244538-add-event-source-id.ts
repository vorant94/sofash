import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class AddEventSourceId1691221244538 implements MigrationInterface {
  name = 'AddEventSourceId1691221244538';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event" DROP CONSTRAINT "FK_d2c82c8bbf211f4b6f86f415024"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" ALTER COLUMN "sourceId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_d2c82c8bbf211f4b6f86f415024" FOREIGN KEY ("sourceId") REFERENCES "event_source"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event" DROP CONSTRAINT "FK_d2c82c8bbf211f4b6f86f415024"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" ALTER COLUMN "sourceId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "event" ADD CONSTRAINT "FK_d2c82c8bbf211f4b6f86f415024" FOREIGN KEY ("sourceId") REFERENCES "event_source"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
