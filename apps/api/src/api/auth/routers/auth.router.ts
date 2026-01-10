import { OpenAPIHono } from "@hono/zod-openapi";
import { signupRoute } from "@api/auth/schemas/signup.schema";
import { signupHandler } from "@api/auth/handlers/signup.handler";

const app = new OpenAPIHono();

app.openapi(signupRoute, async (c) => {
  const body = await c.req.json();
  const user = await signupHandler(body);
  return c.json(user);
});

export default app;