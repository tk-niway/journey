import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import users from "./users";
import { cors } from "hono/cors";
import { OPENAPI_INFO } from "../../consts/openapi-info";

const app = new OpenAPIHono();

app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
}));

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

app.route("api", users);

export default app;