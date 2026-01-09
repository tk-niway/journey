import { serve } from '@hono/node-server';
import api from './api';
import generateOpenApiYml from '../scripts/generate-openapi-yml';
import env from '@consts/env';
import logger from '@lib/logger';
import { EmailAlreadyExistsError, UserAlreadyExistsError } from '@domains/user/errors/user.error';
import { UserTableCreateError } from '@db/users/users-table.error';

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

api.onError((err, c) => {
  logger.error("Global Error Handler", err);

  if (err instanceof UserAlreadyExistsError) {
    return c.json({ error: err.message }, 409);
  }

  if (err instanceof EmailAlreadyExistsError) {
    return c.json({ error: err.message }, 409);
  }

  if (err instanceof UserTableCreateError) {
    return c.json({ error: err.message }, 500);
  }

  return c.json({ error: "Internal Server Error" }, 500);
});

api.notFound((c) => {
  return c.json({ error: `Not Found ${c.req.path}` }, 404);
});

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