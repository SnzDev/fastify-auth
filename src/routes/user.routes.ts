import { FastifyTypedInstance } from '../@types/fastify-typed-instance';
import { userMiddleware } from '../middlewares/user-middleware';

export function userRoutes(app: FastifyTypedInstance) {
  app.addHook('preHandler', (req, reply) => userMiddleware(req, reply, app));
}
