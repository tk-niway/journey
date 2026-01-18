import { noteObjectSchema } from '@api/lib/schemas/note/note-object.schema';
import { createRoute, z } from '@hono/zod-openapi';

const removeTagParams = z.object({
  id: z
    .string()
    .min(1)
    .openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: 'note-id',
    }),
  tagName: z
    .string()
    .min(1)
    .openapi({
      param: {
        name: 'tagName',
        in: 'path',
      },
      example: 'tag',
    }),
});

type RemoveTagParams = z.infer<typeof removeTagParams>;

const removeTagResponse = noteObjectSchema;

type RemoveTagResponse = z.infer<typeof removeTagResponse>;

const removeTagRoute = createRoute({
  path: '/{id}/tags/{tagName}',
  method: 'delete',
  request: {
    params: removeTagParams,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: removeTagResponse,
        },
      },
      description: 'Remove tag from note',
    },
  },
});

export {
  removeTagParams,
  type RemoveTagParams,
  removeTagResponse,
  type RemoveTagResponse,
  removeTagRoute,
};
