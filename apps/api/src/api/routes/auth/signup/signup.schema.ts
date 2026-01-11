import { userObjectSchema } from '@api/lib/schemas/user/user-object.schema';
import { createRoute, z } from '@hono/zod-openapi';

const signupRequest = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

type SignupRequest = z.infer<typeof signupRequest>;

const signupResponse = userObjectSchema;

type SignupResponse = z.infer<typeof signupResponse>;

const signupRoute = createRoute({
  path: '/signup',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: signupRequest,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: signupResponse,
        },
      },
      description: 'Signup successful',
    },
  },
});

export { signupRoute, SignupRequest, SignupResponse };
