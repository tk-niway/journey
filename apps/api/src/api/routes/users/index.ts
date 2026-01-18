import { OpenAPIHono } from '@hono/zod-openapi';
import { fetchUserByIdRoute } from '@api/routes/users/fetch-user-by-id/fetch-user-by-id.schema';
import { fetchUserByIdHandler } from '@api/routes/users/fetch-user-by-id/fetch-user-by-id.handler';
import { listUsersRoute } from '@api/routes/users/list-users/list-users.schema';
import { listUsersHandler } from '@api/routes/users/list-users/list-users.handler';
import { meHandler } from '@api/routes/users/me/me.handler';
import { meRoute } from '@api/routes/users/me/me.schema';
import { requestUserFromContext } from '@api/middlewares/access-token.middleware';
import { updateMeRoute } from '@api/routes/users/update-me/update-me.schema';
import { updateMeHandler } from '@api/routes/users/update-me/update-me.handler';

const app = new OpenAPIHono();

app.openapi(listUsersRoute, async (c) =>
  c.json(await listUsersHandler(c.req.valid('query')))
);

app.openapi(fetchUserByIdRoute, async (c) =>
  c.json(await fetchUserByIdHandler(c.req.valid('param')))
);

app.openapi(meRoute, async (c) => {
  const user = await meHandler(requestUserFromContext(c));
  return c.json(user);
});

app.openapi(updateMeRoute, async (c) => {
  const user = requestUserFromContext(c);
  const body = c.req.valid('json');
  const updatedUser = await updateMeHandler(user, body);
  return c.json(updatedUser);
});

export default app;
