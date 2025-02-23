import type { FastifyReply, FastifyRequest } from 'fastify';
import { FastifyTypedInstance } from '../@types/fastify-typed-instance';
import { Session } from '../@types/session';

export async function protectedMiddleware(
  req: FastifyRequest,
  reply: FastifyReply,
  app: FastifyTypedInstance
) {
  const token = req.cookies.accessToken;

  if (!token) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }

  const user = app.jwt.decode(token) as Session;

  req.user = user;
}
