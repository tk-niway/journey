import { serve } from '@hono/node-server';
import api from './api';
import generateOpenApiYml from '../scripts/generate-openapi-yml';
import env from '@consts/env';
import logger from '@lib/loggers';

// スキーマファイルを生成
generateOpenApiYml();

logger.info('Server is starting...');

const server = serve(
  {
    fetch: api.fetch,
    hostname: env.HOST,
    port: env.PORT,
  },
  (info) => {
    logger.info(`Server is running on http://${env.HOST}:${info.port}`);
  }
);

// shutdown
const shutdown = (signal: string) => {
  logger.info(`Received ${signal}, shutting down...`);
  server.close((err) => {
    if (err) {
      logger.error('Error during shutdown:', err);
      process.exit(1);
    }
    logger.info('Server closed successfully');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
