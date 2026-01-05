import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import users from "./users";

const app = new OpenAPIHono();

app.get('/health', (c) => {
  return c.text('Hello Hono!');
});

app.get(
  '/docs',
  swaggerUI({
    url: '/schema',
  })
);

app.doc('/schema', {
  openapi: '3.0.0',
  info: {
    title: 'API',
    version: '1.0.0',
  },
});

app.route("api", users);

export default app;