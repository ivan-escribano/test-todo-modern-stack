import { Client } from "pg";

const client = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "Everis20",
  database: "todo_modern_stack",
});

const testConnection = async () => {
  try {
    await client.connect();
    console.log("Connection to PostgreSQL successful!");

    await client.end();
    console.log("Connection closed.");
  } catch (error) {
    console.error("Error connecting to PostgreSQL:", error);
    await client.end();
    process.exit(1);
  }
};

testConnection();
