import { InvalidUserApiError } from '@api/lib/errors/api.error';
import { RequestUser } from '@api/middlewares/access-token.middleware';
import { NoteApplication } from '@applications/note/note.application';
import { toNoteResponse } from '@api/routes/notes/note-response.helper';
import { GetNoteRequest } from '@api/routes/notes/get-note/get-note.schema';

export const getNoteHandler = async (
  params: GetNoteRequest,
  user: RequestUser
) => {
  const noteApplication = new NoteApplication();
  const note = await noteApplication.getNoteById(params.id);
  if (note.values.userId !== user.id) {
    throw new InvalidUserApiError();
  }
  return toNoteResponse(note);
};
