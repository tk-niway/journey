import { OpenAPIHono } from '@hono/zod-openapi';
import { signupRoute } from '@api/routes/auth/signup/signup.schema';
import { signupHandler } from '@api/routes/auth/signup/signup.handler';
import { loginHandler } from '@api/routes/auth/login/login.handler';
import { createAccessToken } from '@api/middlewares/access-token.middleware';
import { loginRoute } from '@api/routes/auth/login/login.schema';

const app = new OpenAPIHono();

app.openapi(signupRoute, async (c) => {
  const body = c.req.valid('json');
  const user = await signupHandler(body);
  return c.json(user);
});

app.openapi(loginRoute, async (c) => {
  const body = c.req.valid('json');
  const user = await loginHandler(body);
  const accessToken = await createAccessToken(c, user.id);
  return c.json({ accessToken, user });
});

export default app;
