import { FastifyTypedInstance } from '../@types/fastify-typed-instance';
import { protectedMiddleware } from '../middlewares/protected-middleware';
import { logout } from './auth/logout';
import { me } from './auth/me';
import { refreshToken } from './auth/refresh-token';

export function protectedRoutes(app: FastifyTypedInstance) {
  app.addHook('preHandler', (req, reply) =>
    protectedMiddleware(req, reply, app)
  );

  app.register(me);
  app.register(refreshToken);
  app.register(logout);
}
