import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { getUserRequest, getUserResponse } from "../schemas/users";
import { getUserById } from "../handlers/users/getUserById";

const getUserRoute = createRoute({
  path: '/users/{id}',
  method: 'get',
  request: {
    params: getUserRequest,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getUserResponse,
        },
      },
      description: 'Retrieve the user',
    },
  },
});

const app = new OpenAPIHono();

app.openapi(getUserRoute, (c) => (
  c.json(getUserById(c.req.valid('param'))))
);


export default app;