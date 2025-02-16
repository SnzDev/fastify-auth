import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import Fastify from 'fastify';
import FastifyJwt from '@fastify/jwt';
import { env } from './env';

const fastify = Fastify();
const prisma = new PrismaClient();

fastify.register(FastifyJwt, {
  secret: env.JWT_SECRET,
});

fastify.post('/login', async (request, reply) => {
  const { email, password } = request.body as {
    email: string;
    password: string;
  };

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return reply.status(401).send({ message: 'Credenciais inválidas' });
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    return reply.status(401).send({ message: 'Credenciais inválidas' });
  }

  const accessToken = fastify.jwt.sign({ userId: user.id });
  const refreshToken = fastify.jwt.sign(
    { userId: user.id },
    { expiresIn: '7d' }
  );

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  return { accessToken, refreshToken };
});

fastify.post('/refresh-token', async (request, reply) => {
  const { refreshToken } = request.body as { refreshToken: string };

  if (!refreshToken) {
    return reply.status(400).send({ message: 'Refresh token é necessário' });
  }

  try {
    const decoded = fastify.jwt.verify(refreshToken) as { userId: number };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      return reply.status(401).send({ message: 'Refresh token inválido' });
    }

    const newAccessToken = fastify.jwt.sign({ userId: user.id });

    return { accessToken: newAccessToken };
  } catch (err) {
    return reply.status(401).send({ message: 'Token inválido ou expirado' });
  }
});

fastify.post('/register', async (request, reply) => {
  const { email, password, name } = request.body as {
    email: string;
    password: string;
    name: string;
  };

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return reply.status(400).send({ message: 'Usuário já existe' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, passwordHash, name },
  });

  return reply.status(201).send({ id: user.id, email: user.email });
});

fastify.listen(
  {
    port: 3333,
  },
  (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  }
);
