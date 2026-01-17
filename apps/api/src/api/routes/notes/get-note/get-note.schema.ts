import { noteObjectSchema } from '@api/lib/schemas/note/note-object.schema';
import { createRoute, z } from '@hono/zod-openapi';

const getNoteRequest = z.object({
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

type GetNoteRequest = z.infer<typeof getNoteRequest>;

const getNoteResponse = noteObjectSchema;

type GetNoteResponse = z.infer<typeof getNoteResponse>;

const getNoteRoute = createRoute({
  path: '/{id}',
  method: 'get',
  request: {
    params: getNoteRequest,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: getNoteResponse,
        },
      },
      description: 'Retrieve note by id',
    },
  },
});

export {
  getNoteRequest,
  type GetNoteRequest,
  getNoteResponse,
  type GetNoteResponse,
  getNoteRoute,
};
