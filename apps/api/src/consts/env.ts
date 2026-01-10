import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.int(),
  DB_FILE_NAME: z.string(),
});

const env = envSchema.parse({
  ...process.env,
  PORT: Number(process.env.PORT || 3000),
});

export default env;
