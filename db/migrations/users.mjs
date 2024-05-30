// migration: CreateUsersTable

export class CreateUsersTable1678888888888 {
  name = "CreateUsersTable1678888888888";

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "users" ("id" SERIAL PRIMARY KEY, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL)`
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
