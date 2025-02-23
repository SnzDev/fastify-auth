import type { FastifyReply, FastifyRequest } from 'fastify';
import { FastifyTypedInstance } from '../@types/fastify-typed-instance';
import { Session } from '../@types/session';

export async function adminMiddleware(
  req: FastifyRequest,
  reply: FastifyReply,
  app: FastifyTypedInstance
) {
  const token = req.cookies.accessToken;

  if (!token) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }

  const user = app.jwt.decode(token) as Session;

  if (user.role === 'USER')
    reply.status(401).send({
      error: 'Apenas usuários do tipo Admin pode fazer essa ação',
    });

  req.user = user;
}
