import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { OPENAPI_INFO } from '@consts/openapi-info';
import { logger as honoLogger } from 'hono/logger';
import logger from '@lib/loggers';
import {
  errorHandler,
  notFoundHandler,
} from '@api/middlewares/error.middleware';
import { verifyAccessToken } from '@api/middlewares/access-token.middleware';
import { apiRoutes } from '@api/routes';

const app = new OpenAPIHono();

app.use(
  '*',
  honoLogger((message) => logger.info(message))
);

app.get('/health', (c) => {
  return c.text('Hello Hono!');
});

app.get(
  '/docs',
  swaggerUI({
    url: '/schema',
  })
);

app.doc('/schema', OPENAPI_INFO);

const API_PREFIX = 'api';
app.use(
  `${API_PREFIX}/*`,
  cors({
    origin: '*',
    allowMethods: ['*'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  })
);
app.use(`${API_PREFIX}/*`, verifyAccessToken);
app.route(API_PREFIX, apiRoutes);

app.onError(errorHandler);
app.notFound(notFoundHandler);

export default app;
