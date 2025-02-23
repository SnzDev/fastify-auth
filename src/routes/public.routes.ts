import { FastifyTypedInstance } from '../@types/fastify-typed-instance';
import { login } from './auth/login';
import { register } from './auth/register';

export function publicRoutes(app: FastifyTypedInstance) {
  app.register(login);
  app.register(register);
}
