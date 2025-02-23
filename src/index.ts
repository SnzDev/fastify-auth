import fastifyCookie from '@fastify/cookie';
import { fastifyCors } from '@fastify/cors';
import FastifyJwt from '@fastify/jwt';
import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { fastify } from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { env } from './env';
import { publicRoutes } from './routes/public.routes';
import { userRoutes } from './routes/user.routes';
import { refreshToken } from './routes/auth/refresh-token';
import { adminRoutes } from './routes/admin.routes';
import { protectedRoutes } from './routes/protected.routes';

const app = fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(require('@fastify/helmet'), {
  global: true,
});

app.register(fastifyCors, {
  origin: 'http://localhost:3000', // Permite todas as origens (modifique conforme necessário)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  strictPreflight: false,
});

app.register(fastifyCookie, {
  secret: env.JWT_SECRET, // Para assinar os cookies (opcional)
  // hook: 'preHandler',
});

app.register(FastifyJwt, {
  secret: env.JWT_SECRET,
});

// Middleware para verificar autenticação pelo cookie
// app.addHook('preHandler', async (req, reply) => {
//   try {
//     const token = req.cookies.token;

//     if (!token) {
//       throw new Error('Token ausente');
//     }

//     req.user = app.jwt.verify(token);
//   } catch (err) {
//     return reply.status(401).send({ error: 'Não autorizado' });
//   }
// });
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Fastify-Auth',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUi, {
  routePrefix: 'docs',
});
app.register(publicRoutes);
app.register(protectedRoutes);
app.register(userRoutes);
app.register(adminRoutes);
app.listen(
  {
    port: 3333,
    host: '0.0.0.0',
  },
  (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  }
);
