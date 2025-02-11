import dotenv from 'dotenv';
import { z } from 'zod';

// Carregar as variáveis de ambiente do arquivo .env
dotenv.config();

const schema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
});

const env = schema.parse(process.env);

export { env };
