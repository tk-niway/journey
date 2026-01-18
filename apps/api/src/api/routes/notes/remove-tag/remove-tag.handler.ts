import { InvalidUserApiError } from '@api/lib/errors/api.error';
import { RequestUser } from '@api/middlewares/access-token.middleware';
import { NoteApplication } from '@applications/note/note.application';
import { toNoteResponse } from '@api/routes/notes/note-response.helper';
import { RemoveTagParams } from '@api/routes/notes/remove-tag/remove-tag.schema';

export const removeTagHandler = async (
  params: RemoveTagParams,
  user: RequestUser
) => {
  const noteApplication = new NoteApplication();
  const currentNote = await noteApplication.getNoteById(params.id);
  if (currentNote.values.userId !== user.id) {
    throw new InvalidUserApiError();
  }
  const note = await noteApplication.removeTagFromNote(
    params.id,
    params.tagName,
    user.id
  );
  return toNoteResponse(note);
};
