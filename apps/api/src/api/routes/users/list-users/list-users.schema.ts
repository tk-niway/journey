import { userObjectSchema } from '@api/lib/schemas/user/user-object.schema';
import { createRoute, z } from '@hono/zod-openapi';

const listUsersQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

type ListUsersQuery = z.infer<typeof listUsersQuery>;

const listUsersResponse = z.object({
  users: z.array(userObjectSchema),
});

type ListUsersResponse = z.infer<typeof listUsersResponse>;

const listUsersRoute = createRoute({
  path: '/',
  method: 'get',
  request: {
    query: listUsersQuery,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: listUsersResponse,
        },
      },
      description: 'List users',
    },
  },
});

export {
  listUsersQuery,
  type ListUsersQuery,
  listUsersResponse,
  type ListUsersResponse,
  listUsersRoute,
};
