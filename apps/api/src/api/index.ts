import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import usersRouter from "@api/users/routers/users.router";
import authRouter from "@api/auth/routers/auth.router";
import { cors } from "hono/cors";
import { OPENAPI_INFO } from "@consts/openapi-info";
import { logger as honoLogger } from "hono/logger";
import logger from "@lib/logger";
import { errorHandler, notFoundHandler } from "@api/common/middlewares/error-handler";

const app = new OpenAPIHono();

app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
}));

app.use("*", honoLogger((message) => logger.info(message)));

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
app.route("api", usersRouter);
app.route("api", authRouter);

app.onError(errorHandler);
app.notFound(notFoundHandler);

export default app;