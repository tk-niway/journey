import { NoteEntity } from '@domains/note/entities/note.entity';

export interface NoteRepository {
  findById(id: string): Promise<NoteEntity | null>;
  findManyByUserId(userId: string): Promise<NoteEntity[]>;
  create(noteEntity: NoteEntity): Promise<NoteEntity>;
  update(noteEntity: NoteEntity): Promise<NoteEntity>;
  delete(id: string): Promise<void>;
}
