import { OpenAPIHono } from '@hono/zod-openapi';
import { requestUserFromContext } from '@api/middlewares/access-token.middleware';
import { listNotesRoute } from '@api/routes/notes/list-notes/list-notes.schema';
import { listNotesHandler } from '@api/routes/notes/list-notes/list-notes.handler';
import { getNoteRoute } from '@api/routes/notes/get-note/get-note.schema';
import { getNoteHandler } from '@api/routes/notes/get-note/get-note.handler';
import { createNoteRoute } from '@api/routes/notes/create-note/create-note.schema';
import { createNoteHandler } from '@api/routes/notes/create-note/create-note.handler';
import { updateNoteRoute } from '@api/routes/notes/update-note/update-note.schema';
import { updateNoteHandler } from '@api/routes/notes/update-note/update-note.handler';
import { deleteNoteRoute } from '@api/routes/notes/delete-note/delete-note.schema';
import { deleteNoteHandler } from '@api/routes/notes/delete-note/delete-note.handler';
import { addTagRoute } from '@api/routes/notes/add-tag/add-tag.schema';
import { addTagHandler } from '@api/routes/notes/add-tag/add-tag.handler';
import { removeTagRoute } from '@api/routes/notes/remove-tag/remove-tag.schema';
import { removeTagHandler } from '@api/routes/notes/remove-tag/remove-tag.handler';

const app = new OpenAPIHono();

app.openapi(listNotesRoute, async (c) =>
  c.json(await listNotesHandler(requestUserFromContext(c)))
);

app.openapi(getNoteRoute, async (c) =>
  c.json(await getNoteHandler(c.req.valid('param'), requestUserFromContext(c)))
);

app.openapi(createNoteRoute, async (c) =>
  c.json(
    await createNoteHandler(c.req.valid('json'), requestUserFromContext(c))
  )
);

app.openapi(updateNoteRoute, async (c) =>
  c.json(
    await updateNoteHandler(
      c.req.valid('param'),
      c.req.valid('json'),
      requestUserFromContext(c)
    )
  )
);

app.openapi(deleteNoteRoute, async (c) =>
  c.json(
    await deleteNoteHandler(c.req.valid('param'), requestUserFromContext(c))
  )
);

app.openapi(addTagRoute, async (c) =>
  c.json(
    await addTagHandler(
      c.req.valid('param'),
      c.req.valid('json'),
      requestUserFromContext(c)
    )
  )
);

app.openapi(removeTagRoute, async (c) =>
  c.json(
    await removeTagHandler(c.req.valid('param'), requestUserFromContext(c))
  )
);

export default app;
