import fastify from "fastify";

import { todosRoutes } from "./modules/todos/todos.routes";

const app = fastify({
  logger: true,
});

app.get("/health", async (request, reply) => {
  return { status: "ok" };
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
