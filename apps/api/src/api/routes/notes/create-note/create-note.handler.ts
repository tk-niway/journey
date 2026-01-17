import { RequestUser } from '@api/middlewares/access-token.middleware';
import { NoteApplication } from '@applications/note/note.application';
import { CreateNoteRequest } from '@api/routes/notes/create-note/create-note.schema';
import { toNoteResponse } from '@api/routes/notes/note-response.helper';

export const createNoteHandler = async (
  params: CreateNoteRequest,
  user: RequestUser
) => {
  const noteApplication = new NoteApplication();
  const note = await noteApplication.createNote({
    title: params.title,
    content: params.content,
    userId: user.id,
    tags: params.tags,
  });
  return toNoteResponse(note);
};
