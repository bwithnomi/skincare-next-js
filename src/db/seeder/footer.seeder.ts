import { MySql2Database } from "drizzle-orm/mysql2";
import { footer } from "../schema/footer";

const FooterSeeder = async (db: MySql2Database<typeof import("../schema")>) => {
  await db
    .insert(footer)
    .values({})
    .then(() => {
      console.log(`footer seeded`);
    });
};

export default FooterSeeder;
