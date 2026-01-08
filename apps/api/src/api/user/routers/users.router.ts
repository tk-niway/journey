import { OpenAPIHono } from "@hono/zod-openapi";
import { fetchUserByIdRoute } from "../schemas/fetch-user-by-id.schema";
import { fetchUserByIdHandler } from "../handlers/fetch-user-by-id.handler";

const app = new OpenAPIHono();

app.openapi(fetchUserByIdRoute, async (c) => (
  c.json(await fetchUserByIdHandler(c.req.valid('param'))))
);

export default app;