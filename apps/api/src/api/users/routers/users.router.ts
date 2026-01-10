import { OpenAPIHono } from '@hono/zod-openapi';
import { fetchUserByIdRoute } from '@api/users/schemas/fetch-user-by-id.schema';
import { fetchUserByIdHandler } from '@api/users/handlers/fetch-user-by-id.handler';
import { meHandler } from '@api/users/handlers/me.handler';
import { meRoute } from '@api/users/schemas/me.schema';
import { requestUserFromContext } from '@api/common/middlewares/access-token-handler';

const app = new OpenAPIHono();

app.openapi(fetchUserByIdRoute, async (c) =>
  c.json(await fetchUserByIdHandler(c.req.valid('param')))
);

app.openapi(meRoute, async (c) => {
  const user = await meHandler(requestUserFromContext(c));
  return c.json(user);
});

export default app;
