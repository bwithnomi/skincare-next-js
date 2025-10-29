import { Pool } from "pg";
import AdminSeeder from "./admin.seeder";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./../schema"
import "dotenv/config";
import FooterSeeder from "./footer.seeder";

const seeder = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  
  const db = drizzle(pool, { schema });
  await AdminSeeder(db);
  await FooterSeeder(db)
};

seeder()
  .then(() => {
    console.log(`Data Seeded`);
    process.exit(1);
  })
  .catch((err) => {
    console.log(err);
    process.exit(0);
  });
