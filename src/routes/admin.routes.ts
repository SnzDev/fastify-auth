import { FastifyTypedInstance } from '../@types/fastify-typed-instance';
import { adminMiddleware } from '../middlewares/admin-middleware';

export function adminRoutes(app: FastifyTypedInstance) {
  app.addHook('preHandler', (req, reply) => adminMiddleware(req, reply, app));
}
