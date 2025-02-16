import { ZodSchema } from 'zod';
import { FastifyReply } from 'fastify';

export function validateSchema<T>(
  schema: ZodSchema<T>,
  data: unknown,
  reply: FastifyReply
): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    reply.status(400).send({
      error: 'Validation error',
      details: result.error,
    });

    return {} as T;
  }

  return result.data;
}
