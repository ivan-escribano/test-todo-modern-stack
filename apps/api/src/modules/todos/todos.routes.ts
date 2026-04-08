import { FastifyPluginAsync } from "fastify";

import { todosService } from "./todos.service";

export const todosRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async (request, reply) => {
    const todos = await todosService.getAll();

    return { todos };
  });

  app.post("/", async (request, reply) => {
    const { title, description } = request.body as CreateTodoInput;

    const newTodo = await todosService.create({ title, description });

    return { todo: newTodo };
  });

  app.put("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const { title, description, completed } = request.body as UpdateTodoInput;

    const updatedTodo = await todosService.update({
      id,
      title,
      description,
      completed,
    });

    return { todo: updatedTodo };
  });

  app.delete("/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    const deletedTodo = await todosService.remove(id);

    return { todo: deletedTodo };
  });
};
