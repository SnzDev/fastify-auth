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
import { routes } from './routes';

const app = fastify().withTypeProvider<ZodTypeProvider>();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifyCors, { origin: '*' });

app.register(FastifyJwt, {
  secret: env.JWT_SECRET,
});

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
app.register(routes);
app.listen(
  {
    port: 3333,
  },
  (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  }
);
