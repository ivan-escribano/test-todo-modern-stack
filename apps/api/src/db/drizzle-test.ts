import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

import "dotenv/config";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

const main = async () => {
  await client.connect();

  const db = drizzle(client);
  const result = await db.execute(sql`select 1 as connected`);

  console.log(result);

  await client.end();
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
