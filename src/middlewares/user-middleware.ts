import type { FastifyReply, FastifyRequest } from 'fastify';
import { FastifyTypedInstance } from '../@types/fastify-typed-instance';
import { Session } from '../@types/session';

export async function userMiddleware(
  req: FastifyRequest,
  reply: FastifyReply,
  app: FastifyTypedInstance
) {
  const token = req.cookies.accessToken as string;

  if (!token) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }

  const user = app.jwt.decode(token) as Session;

  if (user.role === 'ADMIN')
    reply.code(403).send({
      error: 'Apenas usuários do tipo User pode fazer essa ação',
    });

  req.user = user;
}
