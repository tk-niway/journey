import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import usersRouter from '@api/routes/users/index';
import authRouter from '@api/routes/auth/index';
import { cors } from 'hono/cors';
import { OPENAPI_INFO } from '@consts/openapi-info';
import { logger as honoLogger } from 'hono/logger';
import logger from '@lib/logger';
import {
  errorHandler,
  notFoundHandler,
} from '@api/middlewares/error.middleware';
import { verifyAccessToken } from '@api/middlewares/access-token.middleware';

const app = new OpenAPIHono();

app.use(
  '/api/*',
  cors({
    origin: '*',
    allowMethods: ['*'],
    allowHeaders: ['Content-Type', 'Authorization'],
    exposeHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  })
);

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
app.use('api/*', verifyAccessToken);
app.route('api', usersRouter);
app.route('api', authRouter);

app.onError(errorHandler);
app.notFound(notFoundHandler);

export default app;
