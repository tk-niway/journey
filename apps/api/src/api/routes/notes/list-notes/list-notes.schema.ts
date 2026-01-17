import { noteObjectSchema } from '@api/lib/schemas/note/note-object.schema';
import { createRoute, z } from '@hono/zod-openapi';

const listNotesResponse = z.array(noteObjectSchema);

type ListNotesResponse = z.infer<typeof listNotesResponse>;

const listNotesRoute = createRoute({
  path: '/',
  method: 'get',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: listNotesResponse,
        },
      },
      description: 'List notes for current user',
    },
  },
});

export { listNotesResponse, type ListNotesResponse, listNotesRoute };
