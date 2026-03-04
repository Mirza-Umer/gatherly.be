import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1772536466818 implements MigrationInterface {
    name = 'Init1772536466818'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"`);
        await queryRunner.query(`CREATE TABLE "post_saved_by_users_user" ("postId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_377aa6a2d6137e72b425a3c983f" PRIMARY KEY ("postId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d972b9a790b1c5ee117fb37122" ON "post_saved_by_users_user" ("postId") `);
        await queryRunner.query(`CREATE INDEX "IDX_518b6223e1bd38f5fc9c3a148c" ON "post_saved_by_users_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "photo"`);
        await queryRunner.query(`ALTER TABLE "post" ADD "mediaType" character varying`);
        await queryRunner.query(`ALTER TABLE "post" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "title" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "caption"`);
        await queryRunner.query(`ALTER TABLE "post" ADD "caption" text`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_saved_by_users_user" ADD CONSTRAINT "FK_d972b9a790b1c5ee117fb371226" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "post_saved_by_users_user" ADD CONSTRAINT "FK_518b6223e1bd38f5fc9c3a148c5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_saved_by_users_user" DROP CONSTRAINT "FK_518b6223e1bd38f5fc9c3a148c5"`);
        await queryRunner.query(`ALTER TABLE "post_saved_by_users_user" DROP CONSTRAINT "FK_d972b9a790b1c5ee117fb371226"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_5c1cf55c308037b5aca1038a131"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "caption"`);
        await queryRunner.query(`ALTER TABLE "post" ADD "caption" character varying`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "title" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "mediaType"`);
        await queryRunner.query(`ALTER TABLE "post" ADD "photo" bytea`);
        await queryRunner.query(`DROP INDEX "public"."IDX_518b6223e1bd38f5fc9c3a148c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d972b9a790b1c5ee117fb37122"`);
        await queryRunner.query(`DROP TABLE "post_saved_by_users_user"`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_5c1cf55c308037b5aca1038a131" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
