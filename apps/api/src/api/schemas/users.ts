import { z } from '@hono/zod-openapi';

const getUserRequest = z.object({
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

type GetUserRequest = z.infer<typeof getUserRequest>;

const getUserResponse = z
  .object({
    id: z.string().openapi({
      example: '123',
    }),
    name: z.string().openapi({
      example: 'John Doe',
    }),
    age: z.number().openapi({
      example: 42,
    }),
  });

type GetUserResponse = z.infer<typeof getUserResponse>;

export { getUserRequest, type GetUserRequest, getUserResponse, type GetUserResponse };