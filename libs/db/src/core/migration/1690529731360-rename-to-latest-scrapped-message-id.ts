import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class RenameToLatestScrappedMessageId1690529731360
  implements MigrationInterface
{
  name = 'RenameToLatestScrappedMessageId1690529731360';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_source" RENAME COLUMN "newestScrappedMessageId" TO "latestScrappedMessageId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event_source" RENAME COLUMN "latestScrappedMessageId" TO "newestScrappedMessageId"`,
    );
  }
}
