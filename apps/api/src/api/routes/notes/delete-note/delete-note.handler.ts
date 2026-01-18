import { InvalidUserApiError } from '@api/lib/errors/api.error';
import { RequestUser } from '@api/middlewares/access-token.middleware';
import { NoteApplication } from '@applications/note/note.application';
import { DeleteNoteParams } from '@api/routes/notes/delete-note/delete-note.schema';

export const deleteNoteHandler = async (
  params: DeleteNoteParams,
  user: RequestUser
) => {
  const noteApplication = new NoteApplication();
  const note = await noteApplication.getNoteById(params.id);
  if (note.values.userId !== user.id) {
    throw new InvalidUserApiError();
  }
  await noteApplication.deleteNote(params.id);
  return { id: params.id };
};
