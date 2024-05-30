// migration: CreateSessionTable

export class CreateSessionTable1678888888889 {
  name = "CreateSessionTable1678888888889";

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "session" ("id" SERIAL PRIMARY KEY, "refresh_token" character varying NOT NULL, "user_id" integer, CONSTRAINT "FK_e5ac8368a9042cf89904e32706b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_e5ac8368a9042cf89904e32706b"`
    );
    await queryRunner.query(`DROP TABLE "session"`);
  }
}
