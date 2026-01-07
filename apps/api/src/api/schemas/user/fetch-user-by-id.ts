import { createRoute, z } from '@hono/zod-openapi';

const fetchUserByIdRequest = z.object({
  id: z
    .string()
    .min(3)
    .openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: '1212121',
    }),
});

type FetchUserByIdRequest = z.infer<typeof fetchUserByIdRequest>;

const fetchUserByIdResponse = z
  .object({
    id: z.string().openapi({
      example: '123',
    }),
    name: z.string().openapi({
      example: 'John Doe',
    }),
    email: z.string().email().openapi({
      example: 'john.doe@example.com',
    }),
    createdAt: z.date().openapi({
      example: '2021-01-01',
    }),
    updatedAt: z.date().openapi({
      example: '2021-01-01',
    }),
  });

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
