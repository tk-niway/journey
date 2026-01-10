import { OpenAPIHono } from '@hono/zod-openapi';
import { signupRoute } from '@api/auth/schemas/signup.schema';
import { signupHandler } from '@api/auth/handlers/signup.handler';
import { loginHandler } from '@api/auth/handlers/login.handler';
import { createAccessToken } from '@api/common/middlewares/access-token-handler';
import { loginRoute } from '@api/auth/schemas/login.schema';

const app = new OpenAPIHono();

app.openapi(signupRoute, async (c) => {
  const body = await c.req.json();
  const user = await signupHandler(body);
  return c.json(user);
});

app.openapi(loginRoute, async (c) => {
  const body = await c.req.json();
  const user = await loginHandler(body);
  const accessToken = await createAccessToken(c, user.id);
  return c.json({ accessToken, user });
});

export default app;
