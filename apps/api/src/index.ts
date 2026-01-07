import 'dotenv/config';
import { serve } from '@hono/node-server';
import api from './api/routers';
import generateOpenApiYml from '../scripts/generate-openapi-yml';
import env from '@consts/env';
import logger from '@lib/logger';

// スキーマファイルを生成
generateOpenApiYml();

logger.info("Server is starting...");
const server = serve({
  fetch: api.fetch,
  hostname: env.HOST,
  port: env.PORT
}, (info) => {
  logger.info(`Server is running on http://${env.HOST}:${info.port}`);
});

// shutdown
process.on('SIGINT', () => {
  server.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  server.close((err) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});