import { createRoute, z } from '@hono/zod-openapi';

const deleteNoteParams = z.object({
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

type DeleteNoteParams = z.infer<typeof deleteNoteParams>;

const deleteNoteResponse = z.object({
  id: z.string(),
});

type DeleteNoteResponse = z.infer<typeof deleteNoteResponse>;

const deleteNoteRoute = createRoute({
  path: '/{id}',
  method: 'delete',
  request: {
    params: deleteNoteParams,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: deleteNoteResponse,
        },
      },
      description: 'Delete note',
    },
  },
});

export {
  deleteNoteParams,
  type DeleteNoteParams,
  deleteNoteResponse,
  type DeleteNoteResponse,
  deleteNoteRoute,
};
