import { z } from '@hono/zod-openapi';

export const errorSchema = z.object({
  error: z.object({
    code: z.string().openapi({
      example: 'USER_ID_ALREADY_EXISTS',
    }),
    message: z.string().openapi({
      example: 'ユーザーが見つかりませんでした',
    }),
  }),
});

export type ErrorResponse = z.infer<typeof errorSchema>;
