import { FastifyTypedInstance } from '../../@types/fastify-typed-instance';
import { Session } from '../../@types/session';
import { db } from '../../utils/db';

export function logout(app: FastifyTypedInstance) {
  app.post(
    '/logout',
    {
      schema: {
        description: 'Do logout on system',
        tags: ['auth'],
      },
    },
    async (request, reply) => {
      const token = request.cookies.accessToken;

      if (token) {
        const user = app.jwt.decode(token) as Session;

        await db.user.update({
          data: {
            refreshToken: null,
          },
          where: {
            id: user.id,
          },
        });
      }

      reply.clearCookie('refreshToken').clearCookie('accessToken').send();
    }
  );
}
