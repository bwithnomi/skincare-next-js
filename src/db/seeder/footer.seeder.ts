import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { footer } from "../schema/footer";

const FooterSeeder = async (db: NodePgDatabase<typeof import("../schema")>) => {
  await db
    .insert(footer)
    .values({})
    .then(() => {
      console.log(`footer seeded`);
    });
};

export default FooterSeeder;
