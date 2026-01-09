import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import usersRouter from "./user/routers/users.router";
import authRouter from "./auth/routers/auth.router";
import { cors } from "hono/cors";
import { OPENAPI_INFO } from "../consts/openapi-info";
import { logger as honoLogger } from "hono/logger";
import logger from "@lib/logger";
import { UserTableCreateError } from "@db/users/users-table.error";
import { UserAlreadyExistsError, EmailAlreadyExistsError } from "@domains/user/errors/user.error";
import { UserApiUserNotFoundError } from "./user/errors/user-api.error";
import { ErrorResponse } from "./schemas/error.schema";

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

const createErrorResponse = (
  error: string,
  code: string
): ErrorResponse => {
  return {
    error: {
      message: error,
      code
    }
  };
};

app.onError((err, c) => {
  logger.error("Global Error Handler", err);

  if (err instanceof UserAlreadyExistsError) {
    return c.json(createErrorResponse(err.message, err.code), 409);
  }
  if (err instanceof EmailAlreadyExistsError) {
    return c.json(createErrorResponse(err.message, err.code), 409);
  }

  if (err instanceof UserTableCreateError) {
    return c.json(createErrorResponse(err.message, err.code), 500);
  }

  if (err instanceof UserApiUserNotFoundError) {
    return c.json(createErrorResponse(err.message, err.code), 404);
  }

  return c.json(createErrorResponse("Internal Server Error", "INTERNAL_SERVER_ERROR"), 500);
});

app.notFound((c) => {
  return c.json({ error: `Not Found ${c.req.path}` }, 404);
});

export default app;