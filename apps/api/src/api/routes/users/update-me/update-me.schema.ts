import {
  userEmail,
  userName,
  userObjectSchema,
} from '@api/lib/schemas/user/user-object.schema';
import { createRoute, z } from '@hono/zod-openapi';

const updateMeRequest = z
  .object({
    name: userName.optional(),
    email: userEmail.optional(),
    currentPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .optional(),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .optional(),
  })
  .superRefine((values, ctx) => {
    if (!values.name && !values.email && !values.newPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '少なくとも1つの変更項目が必要です',
        path: [],
      });
    }

    if (values.newPassword && !values.currentPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '現在のパスワードが必要です',
        path: ['currentPassword'],
      });
    }
  });

type UpdateMeRequest = z.infer<typeof updateMeRequest>;

const updateMeResponse = userObjectSchema;

type UpdateMeResponse = z.infer<typeof updateMeResponse>;

const updateMeRoute = createRoute({
  path: '/me',
  method: 'patch',
  request: {
    body: {
      content: {
        'application/json': {
          schema: updateMeRequest,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: updateMeResponse,
        },
      },
      description: 'Update current user',
    },
  },
});

export {
  updateMeRequest,
  type UpdateMeRequest,
  updateMeResponse,
  type UpdateMeResponse,
  updateMeRoute,
};
