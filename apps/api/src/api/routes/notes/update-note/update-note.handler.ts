import { InvalidUserApiError } from '@api/lib/errors/api.error';
import { RequestUser } from '@api/middlewares/access-token.middleware';
import { NoteApplication } from '@applications/note/note.application';
import { toNoteResponse } from '@api/routes/notes/note-response.helper';
import {
  UpdateNoteParams,
  UpdateNoteRequest,
} from '@api/routes/notes/update-note/update-note.schema';

export const updateNoteHandler = async (
  params: UpdateNoteParams,
  body: UpdateNoteRequest,
  user: RequestUser
) => {
  const noteApplication = new NoteApplication();
  const currentNote = await noteApplication.getNoteById(params.id);
  if (currentNote.values.userId !== user.id) {
    throw new InvalidUserApiError();
  }
  const note = await noteApplication.updateNote({
    id: params.id,
    title: body.title,
    content: body.content,
    userId: user.id,
  });
  return toNoteResponse(note);
};
