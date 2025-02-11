import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import Fastify from 'fastify';
import FastifyJwt from 'fastify-jwt';
import { env } from './env';

const fastify = Fastify();
const prisma = new PrismaClient();

// Configuração do JWT
fastify.register(FastifyJwt, {
  secret: env.JWT_SECRET, // Troque por uma chave secreta de produção
});

// Registrar rota de login
fastify.post('/login', async (request, reply) => {
  const { email, password } = request.body as {
    email: string;
    password: string;
  };

  // Verificar se o usuário existe
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return reply.status(401).send({ message: 'Credenciais inválidas' });
  }

  // Comparar a senha
  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    return reply.status(401).send({ message: 'Credenciais inválidas' });
  }

  // Gerar tokens JWT (access token e refresh token)
  const accessToken = fastify.jwt.sign({ userId: user.id });
  const refreshToken = fastify.jwt.sign(
    { userId: user.id },
    { expiresIn: '7d' }
  ); // Expires in 7 days

  // Atualizar o refresh token no banco de dados
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  // Retornar os tokens
  return { accessToken, refreshToken };
});

// Rota para refresh token
fastify.post('/refresh-token', async (request, reply) => {
  const { refreshToken } = request.body as { refreshToken: string };

  if (!refreshToken) {
    return reply.status(400).send({ message: 'Refresh token é necessário' });
  }

  try {
    // Verificar e validar o refresh token
    const decoded = fastify.jwt.verify(refreshToken) as { userId: number };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.refreshToken !== refreshToken) {
      return reply.status(401).send({ message: 'Refresh token inválido' });
    }

    // Gerar um novo access token
    const newAccessToken = fastify.jwt.sign({ userId: user.id });

    return { accessToken: newAccessToken };
  } catch (err) {
    return reply.status(401).send({ message: 'Token inválido ou expirado' });
  }
});

// Registrar rota de criação de usuário
fastify.post('/register', async (request, reply) => {
  const { email, password } = request.body as {
    email: string;
    password: string;
  };

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return reply.status(400).send({ message: 'Usuário já existe' });
  }

  // Criptografar a senha
  const passwordHash = await bcrypt.hash(password, 10);

  // Criar o novo usuário
  const user = await prisma.user.create({
    data: { email, passwordHash },
  });

  return reply.status(201).send({ id: user.id, email: user.email });
});

// Inicializar o servidor
fastify.listen({
  port:3333
}, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
