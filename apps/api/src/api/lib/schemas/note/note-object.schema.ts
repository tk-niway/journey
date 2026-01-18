import { z } from '@hono/zod-openapi';

const noteTagObjectSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const noteObjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  userId: z.string(),
  tags: z.array(noteTagObjectSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export { noteObjectSchema, noteTagObjectSchema };
