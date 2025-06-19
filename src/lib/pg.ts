import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../db";

export const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL!,
  },
  schema,
});
