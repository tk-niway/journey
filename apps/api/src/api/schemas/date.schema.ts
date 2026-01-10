import { z } from '@hono/zod-openapi';

export const createdAt = z.date().openapi({
  example: '2021-01-01',
});

export type CreatedAt = z.infer<typeof createdAt>;

export const updatedAt = z.date().openapi({
  example: '2021-01-01',
});

export type UpdatedAt = z.infer<typeof updatedAt>;
