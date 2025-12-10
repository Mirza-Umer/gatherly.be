import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1765397185458 implements MigrationInterface {
    name = 'Init1765397185458'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "image" TO "photo"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "photo" TO "image"`);
    }

}
