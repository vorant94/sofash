import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class AddNewestScrappedMessageId1689745317880
  implements MigrationInterface
{
  name = 'AddNewestScrappedMessageId1689745317880';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_source" ADD "newestScrappedMessageId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_source" ADD CONSTRAINT "UQ_8c9313f2f301483e24d69e30b54" UNIQUE ("uri")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_source" DROP CONSTRAINT "UQ_8c9313f2f301483e24d69e30b54"`,
    );
    await queryRunner.query(
      `ALTER TABLE "event_source" DROP COLUMN "newestScrappedMessageId"`,
    );
  }
}
