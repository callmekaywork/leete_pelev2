import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";

import bcrypt from "bcrypt";

import { config } from "dotenv";
import { users } from "@/db/schema";

config({ path: ".env" });

const db = drizzle(`${process.env.DATABASE_URL!}`);

async function seedSuperAdmin() {
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, "callmekaywork@gmail.com"));

  if (existing.length == 0) {
    console.log("No user was found!");
    console.log("Hashing password!");
    const hash = await bcrypt.hash("Nyokongadmin@4891", 10);

    // password hashing step
    console.log("Password hashed! \nNow adding user to table!");

    const adding_user = await db.insert(users).values({
      firstname: "Khotso",
      lastname: "Nyokong",
      email: "callmekaywork@gmail.com",
      role: "admin",
      password: `${hash}`,
    });

    if (adding_user) {
      console.log("Super admin seeded");
    }
  } else {
    console.log("Super admin already exists");
  }
}

seedSuperAdmin().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
