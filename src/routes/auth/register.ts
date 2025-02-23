import * as bcrypt from 'bcrypt';
import { z } from 'zod';
import { FastifyTypedInstance } from '../../@types/fastify-typed-instance';
import { db } from '../../utils/db';

export function register(app: FastifyTypedInstance) {
  app.post(
    '/register',
    {
      schema: {
        description: 'Register a new user',
        tags: ['auth'],
        body: z.object({
          email: z.string().email(),
          password: z.string(),
          name: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { email, password, name } = request.body;

      const existingUser = await db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return reply.status(400).send({ message: 'Usuário já existe' });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await db.user.create({
        data: { email, passwordHash, name },
      });

      return reply.status(201).send({ id: user.id, email: user.email });
    }
  );
}
