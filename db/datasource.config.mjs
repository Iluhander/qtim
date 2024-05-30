import path from "path";
import { cwd } from "process";
import { DataSource } from "typeorm"

const ds = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "postgres",
  migrations: ['./db/migrations/**/*.mjs'],
  synchronize: false
});

ds.initialize();

export default ds;
