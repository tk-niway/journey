import { z } from '@hono/zod-openapi';

export const userId = z.string().min(1).openapi({
  example: '123',
});

export const userEmail = z.email('Invalid email').openapi({
  example: 'john.doe@example.com',
});

export const userName = z.string().min(1, 'Name is required').openapi({
  example: 'John Doe',
});

export const userObjectSchema = z.object({
  id: userId,
  email: userEmail,
  name: userName,
  createdAt: z.date().openapi({
    example: '2021-01-01',
  }),
  updatedAt: z.date().openapi({
    example: '2021-01-01',
  }),
});

export type UserObject = z.infer<typeof userObjectSchema>;
