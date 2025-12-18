import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1765808601765 implements MigrationInterface {
    name = 'Init1765808601765'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_8a6cdd56be8ef9b327f2d154dfc"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_042b9825d770d6b3009ae206c2f"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "postsId"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "commentsId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "commentsId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD "postsId" integer`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_042b9825d770d6b3009ae206c2f" FOREIGN KEY ("commentsId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_8a6cdd56be8ef9b327f2d154dfc" FOREIGN KEY ("postsId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
