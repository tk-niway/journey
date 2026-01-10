import { z } from '@hono/zod-openapi';
import { createdAt, updatedAt } from '@api/common/schemas/date.schema';

export const userId = z.string().min(1).openapi({
  example: '123',
});

export const userEmail = z.string().openapi({
  example: 'john.doe@example.com',
});

export const userName = z.string().openapi({
  example: 'John Doe',
});

export const userObjectSchema = z
  .object({
    id: userId,
    email: userEmail,
    name: userName,
    createdAt: createdAt,
    updatedAt: updatedAt,
  });

export type UserObjectSchema = z.infer<typeof userObjectSchema>;