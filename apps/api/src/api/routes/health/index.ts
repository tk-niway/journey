import { OpenAPIHono } from '@hono/zod-openapi';

const app = new OpenAPIHono();

app.get('/health', (c) => {
  return c.text('Health check successful');
});

export default app;
