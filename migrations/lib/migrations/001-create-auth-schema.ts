import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuthSchemaMigration1678886400010 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        try{
            await queryRunner.query(`CREATE SCHEMA auth AUTHORIZATION able-dev;`);
        }catch (e){
            console.log(e);
        }
    }

    public async down(queryRunner: QueryRunner) {
        return null;
    }
}
