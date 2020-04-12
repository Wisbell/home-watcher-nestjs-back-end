import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1586732769714 implements MigrationInterface {
    name = 'InitialMigration1586732769714'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "incident" ("id" SERIAL NOT NULL, "dateCreated" character varying NOT NULL, "text" character varying NOT NULL, "imageId" integer, CONSTRAINT "REL_edcf86e779912ade2aaa403d6a" UNIQUE ("imageId"), CONSTRAINT "PK_5f90b28b0b8238d89ee8edcf96e" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "image" ("id" SERIAL NOT NULL, "dateCreated" character varying NOT NULL, "name" character varying NOT NULL, "image" character varying NOT NULL, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "salt" character varying NOT NULL, "role" character varying NOT NULL, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`ALTER TABLE "incident" ADD CONSTRAINT "FK_edcf86e779912ade2aaa403d6ae" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "incident" DROP CONSTRAINT "FK_edcf86e779912ade2aaa403d6ae"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`DROP TABLE "image"`, undefined);
        await queryRunner.query(`DROP TABLE "incident"`, undefined);
    }

}
