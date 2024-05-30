// migration: CreateArticleTable

export class CreateArticleTable1678888888890 {
  name = "CreateArticleTable1678888888890";

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "article" ("id" SERIAL PRIMARY KEY, "title" character varying NOT NULL, "description" character varying NOT NULL, "publication_date" character varying NOT NULL, "user_id" integer, CONSTRAINT "FK_e1ac8318a0202af89904e32701d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "article"`);
  }
}
