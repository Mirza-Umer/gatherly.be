import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1765397001916 implements MigrationInterface {
    name = 'Init1765397001916'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "image" bytea`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "image"`);
    }

}
