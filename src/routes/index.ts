import { FastifyTypedInstance } from '../@types/fastify-typed-instance';
import { authRoutes } from './auth';

export async function routes(app: FastifyTypedInstance) {
  app.register(authRoutes);
}
