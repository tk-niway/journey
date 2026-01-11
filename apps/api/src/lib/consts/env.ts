import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.int(),
  DB_FILE_NAME: z.string().nonempty('DB_FILE_NAME is required'),
  AUTH_SECRET: z.string().nonempty('AUTH_SECRET is required'),
});

const env = envSchema.parse({
  ...process.env,
  PORT: Number(process.env.PORT || 3000),
});

export default env;
