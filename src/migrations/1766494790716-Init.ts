import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1766494790716 implements MigrationInterface {
    name = 'Init1766494790716'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friend_request" ALTER COLUMN "senderId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "friend_request" ALTER COLUMN "receiverId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "friend_request" ADD CONSTRAINT "FK_9509b72f50f495668bae3c0171c" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friend_request" ADD CONSTRAINT "FK_470e723fdad9d6f4981ab2481eb" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friend_request" DROP CONSTRAINT "FK_470e723fdad9d6f4981ab2481eb"`);
        await queryRunner.query(`ALTER TABLE "friend_request" DROP CONSTRAINT "FK_9509b72f50f495668bae3c0171c"`);
        await queryRunner.query(`ALTER TABLE "friend_request" ALTER COLUMN "receiverId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "friend_request" ALTER COLUMN "senderId" SET NOT NULL`);
    }

}
