import { FastifyTypedInstance } from '../../@types/fastify-typed-instance';
import { Session } from '../../@types/session';

export function me(app: FastifyTypedInstance) {
  app.get(
    '/me',
    {
      schema: {
        description: 'See information about user',
        tags: ['auth'],
      },
    },
    function (request, reply) {
      const user = request.user as Session;

      reply.send(user);
    }
  );
}
