import type { RawRequestDefaultExpression } from 'fastify';
import { Session } from './session';

// Define a request type for authentication middleware
export type AuthenticatedRequest = RawRequestDefaultExpression & {
  user?: Session;
};
