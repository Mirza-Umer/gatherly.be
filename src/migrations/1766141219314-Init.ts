import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1766141219314 implements MigrationInterface {
    name = 'Init1766141219314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "likes" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "likes"`);
    }

}
