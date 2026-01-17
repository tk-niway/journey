import { InvalidUserApiError } from '@api/lib/errors/api.error';
import { RequestUser } from '@api/middlewares/access-token.middleware';
import { NoteApplication } from '@applications/note/note.application';
import { toNoteResponse } from '@api/routes/notes/note-response.helper';
import {
  AddTagParams,
  AddTagRequest,
} from '@api/routes/notes/add-tag/add-tag.schema';

export const addTagHandler = async (
  params: AddTagParams,
  body: AddTagRequest,
  user: RequestUser
) => {
  const noteApplication = new NoteApplication();
  const currentNote = await noteApplication.getNoteById(params.id);
  if (currentNote.values.userId !== user.id) {
    throw new InvalidUserApiError();
  }
  const note = await noteApplication.addTagToNote(
    params.id,
    body.name,
    user.id
  );
  return toNoteResponse(note);
};
