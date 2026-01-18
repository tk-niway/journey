import { noteObjectSchema } from '@api/lib/schemas/note/note-object.schema';
import { createRoute, z } from '@hono/zod-openapi';

const createNoteRequest = z.object({
  title: z.string().min(1, 'Title is required').max(128, 'Title is too long'),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(20000, 'Content is too long'),
  tags: z
    .array(z.string().min(1, 'Tag is required').max(128, 'Tag is too long'))
    .optional(),
});

type CreateNoteRequest = z.infer<typeof createNoteRequest>;

const createNoteResponse = noteObjectSchema;

type CreateNoteResponse = z.infer<typeof createNoteResponse>;

const createNoteRoute = createRoute({
  path: '/',
  method: 'post',
  request: {
    body: {
      content: {
        'application/json': {
          schema: createNoteRequest,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: createNoteResponse,
        },
      },
      description: 'Create note',
    },
  },
});

export {
  createNoteRequest,
  type CreateNoteRequest,
  createNoteResponse,
  type CreateNoteResponse,
  createNoteRoute,
};
