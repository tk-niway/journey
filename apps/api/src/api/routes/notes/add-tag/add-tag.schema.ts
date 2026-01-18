import { noteObjectSchema } from '@api/lib/schemas/note/note-object.schema';
import { createRoute, z } from '@hono/zod-openapi';

const addTagParams = z.object({
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
});

const addTagRequest = z.object({
  name: z.string().min(1, 'Tag is required').max(128, 'Tag is too long'),
});

type AddTagParams = z.infer<typeof addTagParams>;
type AddTagRequest = z.infer<typeof addTagRequest>;

const addTagResponse = noteObjectSchema;

type AddTagResponse = z.infer<typeof addTagResponse>;

const addTagRoute = createRoute({
  path: '/{id}/tags',
  method: 'post',
  request: {
    params: addTagParams,
    body: {
      content: {
        'application/json': {
          schema: addTagRequest,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: addTagResponse,
        },
      },
      description: 'Add tag to note',
    },
  },
});

export {
  addTagParams,
  addTagRequest,
  type AddTagParams,
  type AddTagRequest,
  addTagResponse,
  type AddTagResponse,
  addTagRoute,
};
