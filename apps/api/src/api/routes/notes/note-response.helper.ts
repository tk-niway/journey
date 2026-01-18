import { NoteEntity } from '@domains/note/entities/note.entity';

type NoteResponse = {
  id: string;
  title: string;
  content: string;
  userId: string;
  tags: Array<{
    id: string;
    name: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
};

export const toNoteResponse = (note: NoteEntity): NoteResponse => ({
  id: note.values.id,
  title: note.values.title,
  content: note.values.content,
  userId: note.values.userId,
  tags: note.tags.map((tag) => ({ id: tag.id, name: tag.name })),
  createdAt: note.values.createdAt,
  updatedAt: note.values.updatedAt,
});
