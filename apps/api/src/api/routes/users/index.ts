import { OpenAPIHono } from '@hono/zod-openapi';
import { fetchUserByIdRoute } from '@api/routes/users/fetch-user-by-id/fetch-user-by-id.schema';
import { fetchUserByIdHandler } from '@api/routes/users/fetch-user-by-id/fetch-user-by-id.handler';
import { meHandler } from '@api/routes/users/me/me.handler';
import { meRoute } from '@api/routes/users/me/me.schema';
import { requestUserFromContext } from '@api/middlewares/access-token.middleware';

const app = new OpenAPIHono();

app.openapi(fetchUserByIdRoute, async (c) =>
  c.json(await fetchUserByIdHandler(c.req.valid('param')))
);

app.openapi(meRoute, async (c) => {
  const user = await meHandler(requestUserFromContext(c));
  return c.json(user);
});

export default app;
