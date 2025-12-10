import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1765385391686 implements MigrationInterface {
    name = 'Init1765385391686'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "caption" character varying, "mediaUrls" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "postsId" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_8a6cdd56be8ef9b327f2d154dfc" FOREIGN KEY ("postsId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_8a6cdd56be8ef9b327f2d154dfc"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "postsId"`);
        await queryRunner.query(`DROP TABLE "post"`);
    }

}
