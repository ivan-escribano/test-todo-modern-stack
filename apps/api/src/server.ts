import cors from "@fastify/cors";
import fastify from "fastify";

import { registerErrorHandler } from "./app/error-handler";
import { todosRoutes } from "./modules/todos/todos.routes";

const app = fastify({
  logger: true,
});

app.get("/health", async (request, reply) => ({ status: "ok" }));

registerErrorHandler(app);

app.register(cors, {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
});

app.register(todosRoutes, { prefix: "/api/todos" });

const start = async () => {
  try {
    await app.listen({ port: 3001 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
