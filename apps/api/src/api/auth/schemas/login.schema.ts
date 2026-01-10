import { userObjectSchema } from '@api/users/schemas/user-object.schema';
import { createRoute, z } from '@hono/zod-openapi';

const loginRequest = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

type LoginRequest = z.infer<typeof loginRequest>;

const loginResponse = z.object({
  accessToken: z.string(),
  user: userObjectSchema,
});

type LoginResponse = z.infer<typeof loginResponse>;

const loginRoute = createRoute({
  path: '/auth/login',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: loginRequest,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: loginResponse,
        },
      },
      description: 'Login successful',
    },
  },
});

export { loginRoute, LoginRequest, LoginResponse };
