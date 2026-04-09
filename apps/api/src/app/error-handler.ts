import { FastifyInstance } from "fastify";

import { BadRequestError, NotFoundError } from "../lib/errors";

export const registerErrorHandler = (app: FastifyInstance) => {
  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    if (error instanceof NotFoundError)
      reply.status(404).send({ message: error.message });
    else if (error instanceof BadRequestError)
      reply.status(400).send({ message: error.message });
    else reply.status(500).send({ message: "Internal Server Error" });
  });
};
