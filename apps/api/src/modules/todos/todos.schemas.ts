import { FastifySchema } from "fastify";

const todosParamSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
  },
  required: ["id"],
  additionalProperties: false,
};

export const createTodoSchema: FastifySchema = {
  body: {
    type: "object",
    properties: {
      title: { type: "string", minLength: 1 },
      description: { type: "string" },
    },
    required: ["title"],
    additionalProperties: false,
  },
};

export const updateTodoSchema: FastifySchema = {
  params: todosParamSchema,
  body: {
    type: "object",
    properties: {
      title: { type: "string", minLength: 1 },
      description: { type: "string" },
      completed: { type: "boolean" },
    },
    additionalProperties: false,
    minProperties: 1,
  },
};

export const deleteTodoSchema: FastifySchema = {
  params: todosParamSchema,
};
