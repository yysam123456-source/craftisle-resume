import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "@reactive-resume/env/server";
import { relations } from "./relations";

declare global {
  var __pool: Pool | undefined;
  var __drizzle: NodePgDatabase<typeof relations> | undefined;
}

export function getPool() {
  if (!globalThis.__pool) {
    const pool = new Pool({
      connectionString: env.DATABASE_URL,
      options: "-c search_path=resume,public",
    });

    // Ensure the "resume" schema exists on first connection.
    let initialized = false;
    pool.on("connect", async (client) => {
      if (!initialized) {
        initialized = true;
        try {
          await client.query(`CREATE SCHEMA IF NOT EXISTS "resume"`);
        } catch {
          // Ignore — schema may already exist or user lacks permissions.
          // The app will fail later with a clearer error if the schema is truly missing.
        }
      }
    });

    globalThis.__pool = pool;
  }
  return globalThis.__pool;
}

function makeDrizzleClient() {
  return drizzle({ client: getPool(), relations });
}

export function createDatabase() {
  if (!globalThis.__drizzle) {
    globalThis.__drizzle = makeDrizzleClient();
  }
  return globalThis.__drizzle;
}

export const db = createDatabase();
