import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class RenameSourceMessageId1691223843000 implements MigrationInterface {
  name = 'RenameSourceMessageId1691223843000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event" RENAME COLUMN "eventSourceMessageId" TO "sourceMessageId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "event" RENAME COLUMN "sourceMessageId" TO "eventSourceMessageId"`,
    );
  }
}
