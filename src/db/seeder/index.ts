import mysql from "mysql2/promise";
import AdminSeeder from "./admin.seeder";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./../schema";
import "dotenv/config";
import FooterSeeder from "./footer.seeder";

const seeder = async () => {
  const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
  });

  const db = drizzle(pool, { schema, mode: "default" });
  await AdminSeeder(db);
  await FooterSeeder(db);
  await pool.end();
};

seeder()
  .then(() => {
    console.log(`Data Seeded`);
    process.exit(0);
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
