import { RequestUser } from '@api/middlewares/access-token.middleware';
import { NoteApplication } from '@applications/note/note.application';
import { toNoteResponse } from '@api/routes/notes/note-response.helper';

export const listNotesHandler = async (user: RequestUser) => {
  const noteApplication = new NoteApplication();
  const notes = await noteApplication.findNotesByUserId(user.id);
  return notes.map(toNoteResponse);
};
