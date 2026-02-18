import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1771266662959 implements MigrationInterface {
    name = 'Init1771266662959'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "saved_post" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "postId" integer, CONSTRAINT "PK_9db498bd687bbeb13faf83ac98d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "saved_post" ADD CONSTRAINT "FK_9e99affc0bf212c06c0fd53530f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "saved_post" ADD CONSTRAINT "FK_e63ab07f9725788aaca1ae059f8" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "saved_post" DROP CONSTRAINT "FK_e63ab07f9725788aaca1ae059f8"`);
        await queryRunner.query(`ALTER TABLE "saved_post" DROP CONSTRAINT "FK_9e99affc0bf212c06c0fd53530f"`);
        await queryRunner.query(`DROP TABLE "saved_post"`);
    }

}
