import { userObjectSchema } from '@api/lib/schemas/user/user-object.schema';
import { createRoute, z } from '@hono/zod-openapi';

const meRequest = z.object({
  accessToken: z.string(),
});

type MeRequest = z.infer<typeof meRequest>;

const meResponse = userObjectSchema;

type MeResponse = z.infer<typeof meResponse>;

const meRoute = createRoute({
  path: '/me',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: meRequest,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Retrieve the current user',
      content: {
        'application/json': {
          schema: meResponse,
        },
      },
    },
  },
});

export { meRequest, type MeRequest, meResponse, type MeResponse, meRoute };
