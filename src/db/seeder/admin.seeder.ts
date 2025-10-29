import { hashPassword } from "@/lib/auth"
import { admins } from "../schema/admin"
import { NodePgDatabase } from "drizzle-orm/node-postgres"

const AdminSeeder = async (db: NodePgDatabase<typeof import("../schema")>) => {
    const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD || "admin123")
    await db.insert(admins).values({
        email: process.env.ADMIN_EMAIL || "admin@example.com",
        password: hashedPassword,
    }).then(() => {
        console.log(`admin seeded`);
        
    })
}

export default AdminSeeder;