import { z } from 'zod';
import { FastifyTypedInstance } from '../../@types/fastify-typed-instance';
import { db } from '../../utils/db';
import * as bcrypt from 'bcrypt';
import { Session } from '../../@types/session';

export function login(app: FastifyTypedInstance) {
  app.post(
    '/login',
    {
      schema: {
        description: 'Do login on system',
        tags: ['auth'],
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { email, password } = request.body;
      const user = await db.user.findUnique({
        where: { email },
      });

      if (!user) {
        return reply.status(401).send({ message: 'Credenciais inválidas' });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);

      if (!isValidPassword) {
        return reply.status(401).send({ message: 'Credenciais inválidas' });
      }
      const data: Session = {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerifiedAt: user.emailVerifiedAt,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      const accessToken = app.jwt.sign(data, {
        expiresIn: '15m',
      });
      const refreshToken = app.jwt.sign(data, { expiresIn: '7d' });

      await db.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      reply
        .clearCookie('accessToken')
        .clearCookie('refreshToken')
        .setCookie('accessToken', accessToken, {
          httpOnly: true, // Protege contra ataques XSS
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          expires: new Date(Date.now() + 15 * 60 * 1000), // Set expiration date for 15 min
        })
        .setCookie('refreshToken', refreshToken, {
          httpOnly: true, // Protege contra ataques XSS
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set expiration date for 7 days
        })
        .send({ accessToken, refreshToken });
    }
  );
}
