import { noteObjectSchema } from '@api/lib/schemas/note/note-object.schema';
import { createRoute, z } from '@hono/zod-openapi';

const updateNoteParams = z.object({
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

const updateNoteRequest = z.object({
  title: z.string().min(1, 'Title is required').max(128, 'Title is too long'),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(20000, 'Content is too long'),
});

type UpdateNoteParams = z.infer<typeof updateNoteParams>;
type UpdateNoteRequest = z.infer<typeof updateNoteRequest>;

const updateNoteResponse = noteObjectSchema;

type UpdateNoteResponse = z.infer<typeof updateNoteResponse>;

const updateNoteRoute = createRoute({
  path: '/{id}',
  method: 'patch',
  request: {
    params: updateNoteParams,
    body: {
      content: {
        'application/json': {
          schema: updateNoteRequest,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: updateNoteResponse,
        },
      },
      description: 'Update note',
    },
  },
});

export {
  updateNoteParams,
  updateNoteRequest,
  type UpdateNoteParams,
  type UpdateNoteRequest,
  updateNoteResponse,
  type UpdateNoteResponse,
  updateNoteRoute,
};
