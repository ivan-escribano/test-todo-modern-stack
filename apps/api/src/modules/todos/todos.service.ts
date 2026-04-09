import { eq } from "drizzle-orm";

import { db } from "../../db";
import { todos } from "../../db/schema";
import { NotFoundError } from "../../lib/errors";

const getAll = async () => {
  return await db.select().from(todos);
};

const create = async (data: CreateTodoInput) => {
  const [newTodo] = await db.insert(todos).values(data).returning();

  return newTodo;
};

const update = async (data: UpdateTodoInput) => {
  const { id, ...updateData } = data;

  const [updateTodo] = await db
    .update(todos)
    .set(updateData)
    .where(eq(todos.id, id))
    .returning();

  if (!updateTodo) throw new NotFoundError("Todo not found");

  return updateTodo;
};

const remove = async (id: string) => {
  const [deletedTodo] = await db
    .delete(todos)
    .where(eq(todos.id, id))
    .returning();

  if (!deletedTodo) throw new NotFoundError("Todo not found");

  return deletedTodo;
};

export const todosService = {
  getAll,
  create,
  update,
  remove,
};
