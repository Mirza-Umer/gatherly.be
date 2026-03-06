import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1772811450079 implements MigrationInterface {
    name = 'Init1772811450079'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "occupation"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "bio"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "city"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "city" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "bio" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "occupation" character varying`);
    }

}
