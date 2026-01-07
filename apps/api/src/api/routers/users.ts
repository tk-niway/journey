import { OpenAPIHono } from "@hono/zod-openapi";
import { fetchUserByIdRoute } from "../schemas/user/fetch-user-by-id";
import { fetchUserById } from "../handlers/user/fetch-user-by-id";

const app = new OpenAPIHono();

app.openapi(fetchUserByIdRoute, async (c) => (
  c.json(await fetchUserById(c.req.valid('param'))))
);

export default app;