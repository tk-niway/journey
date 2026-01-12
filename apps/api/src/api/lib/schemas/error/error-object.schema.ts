import { z } from '@hono/zod-openapi';
import { ErrorCode } from '@shared/error-code.const';

export const errorObjectSchema = z.object({
  error: z.object({
    code: z.enum(ErrorCode).openapi({
      example: 'TOKEN_NOT_FOUND',
    }),
    message: z.string().openapi({
      example: 'ユーザーが見つかりませんでした',
    }),
  }),
});

export type ErrorObject = z.infer<typeof errorObjectSchema>;
