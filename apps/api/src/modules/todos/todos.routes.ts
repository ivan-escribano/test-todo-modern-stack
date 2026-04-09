import { FastifyPluginAsync } from "fastify";

import {
  createTodoSchema,
  deleteTodoSchema,
  updateTodoSchema,
} from "./todos.schemas";
import { todosService } from "./todos.service";

export const todosRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async (request, reply) => {
    const todos = await todosService.getAll();

    return { todos };
  });

  app.post<{ Body: CreateTodoInput }>(
    "/",
    { schema: createTodoSchema },
    async (request, reply) => {
      const { title, description } = request.body;

      const newTodo = await todosService.create({ title, description });

      return { todo: newTodo };
    },
  );

  app.put<{ Params: UpdateTodoInput; Body: UpdateTodoInput }>(
    "/:id",
    { schema: updateTodoSchema },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const { title, description, completed } = request.body;

      const updatedTodo = await todosService.update({
        id,
        title,
        description,
        completed,
      });

      return { todo: updatedTodo };
    },
  );

  app.delete<{ Params: { id: string } }>(
    "/:id",
    { schema: deleteTodoSchema },
    async (request, reply) => {
      const { id } = request.params;

      const deletedTodo = await todosService.remove(id);

      return { todo: deletedTodo };
    },
  );
};
