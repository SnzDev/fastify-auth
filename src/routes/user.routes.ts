import { FastifyTypedInstance } from '../@types/fastify-typed-instance';
import { userMiddleware } from '../middlewares/user-middleware';
import { me } from './auth/me';
import { refreshToken } from './auth/refresh-token';

export function userRoutes(app: FastifyTypedInstance) {
  app.addHook('preHandler', (req, reply) => userMiddleware(req, reply, app));
}
