import type {
  FastifyRequest,
  FastifyReply,
  HookHandlerDoneFunction,
} from 'fastify';

export function loggerMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) {
  console.log(`[${new Date().toISOString()}] ${request.method} ${request.url}`);
  done();
}
