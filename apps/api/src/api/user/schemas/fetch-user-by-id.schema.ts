import { createRoute, z } from '@hono/zod-openapi';
import { userId, userObjectSchema } from './user-object.schema';

const fetchUserByIdRequest = z.object({
  id: userId
    .openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: '1212121',
    }),
});

type FetchUserByIdRequest = z.infer<typeof fetchUserByIdRequest>;

const fetchUserByIdResponse = userObjectSchema;

type FetchUserByIdResponse = z.infer<typeof fetchUserByIdResponse>;

const fetchUserByIdRoute = createRoute({
  path: '/users/{id}',
  method: 'get',
  request: {
    params: fetchUserByIdRequest,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: fetchUserByIdResponse,
        },
      },
      description: 'Retrieve the user',
    },
  },
});


export { fetchUserByIdRequest, type FetchUserByIdRequest, fetchUserByIdResponse, type FetchUserByIdResponse, fetchUserByIdRoute };
