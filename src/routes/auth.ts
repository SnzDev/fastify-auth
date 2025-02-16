import * as bcrypt from 'bcrypt';
import { z } from 'zod';
import { FastifyTypedInstance } from '../@types/fastify-typed-instance';
import { Session } from '../@types/session';
import { db } from '../utils/db';
export async function authRoutes(app: FastifyTypedInstance) {
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

      return { accessToken, refreshToken };
    }
  );

  app.post(
    '/refresh-token',
    {
      schema: {
        description: 'Get a new refresh token',
        tags: ['auth'],
        body: z.object({
          refreshToken: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { refreshToken } = request.body as { refreshToken: string };

      if (!refreshToken) {
        return reply
          .status(400)
          .send({ message: 'Refresh token é necessário' });
      }

      try {
        const decoded = app.jwt.verify(refreshToken) as Session;

        const user = await db.user.findUnique({
          where: { id: decoded.id },
        });

        if (!user || user.refreshToken !== refreshToken) {
          return reply.status(401).send({ message: 'Refresh token inválido' });
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
        const newAccessToken = app.jwt.sign(data, {
          expiresIn: '15m',
        });

        return { accessToken: newAccessToken };
      } catch (err) {
        return reply
          .status(401)
          .send({ message: 'Token inválido ou expirado' });
      }
    }
  );

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

  app.get('/me', function (request, reply) {
    // token avaiable via `request.headers.customauthheader` as defined in fastify.register above
    return request.jwtVerify().then(function (decodedToken) {
      return reply.send(decodedToken);
    });
  });
}
