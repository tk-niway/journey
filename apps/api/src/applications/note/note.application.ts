import { databaseService, DatabaseService } from '@db/database.service';
import { NotesTableRepository } from '@db/repositories/notes/notes-table.repository';
import { NoteNotFoundError } from '@domains/note/errors/note.error';
import { NoteFactory } from '@domains/note/factories/note.factory';
import { NoteEntity } from '@domains/note/entities/note.entity';
import { NoteRepository } from '@domains/note/repositories/note-repository.interface';

export class NoteApplication {
  constructor(dbService: DatabaseService = databaseService) {
    this.noteRepository = new NotesTableRepository(dbService);
  }

  private noteRepository: NoteRepository;

  async createNote(input: {
    title: string;
    content: string;
    userId: string;
    tags?: string[];
  }): Promise<NoteEntity> {
    const noteValue = NoteFactory.createNewNoteValue(input);
    const tags = (input.tags ?? []).map((name) =>
      NoteFactory.createNewTagValue({ name, userId: input.userId })
    );
    const noteEntity = NoteFactory.createNoteEntity(noteValue, tags);
    return this.noteRepository.create(noteEntity);
  }

  async findNoteById(id: string): Promise<NoteEntity | null> {
    return this.noteRepository.findById(id);
  }

  async getNoteById(id: string): Promise<NoteEntity> {
    const note = await this.noteRepository.findById(id);
    if (!note) throw new NoteNotFoundError(id);
    return note;
  }

  async findNotesByUserId(userId: string): Promise<NoteEntity[]> {
    return this.noteRepository.findManyByUserId(userId);
  }

  async updateNote(input: {
    id: string;
    title: string;
    content: string;
    userId: string;
    tags?: string[];
  }): Promise<NoteEntity> {
    const currentNote = await this.getNoteById(input.id);
    const noteValue = {
      id: currentNote.values.id,
      title: input.title,
      content: input.content,
      userId: input.userId,
      createdAt: currentNote.values.createdAt,
      updatedAt: new Date(),
    };

    const tags =
      input.tags?.map(
        (name) =>
          NoteFactory.createNewTagValue({ name, userId: input.userId }).values
      ) ?? currentNote.tags;

    const noteEntity = NoteFactory.createNoteEntity(noteValue, tags);
    return this.noteRepository.update(noteEntity);
  }

  async deleteNote(id: string): Promise<void> {
    await this.getNoteById(id);
    await this.noteRepository.delete(id);
  }

  async addTagToNote(
    noteId: string,
    tagName: string,
    userId: string
  ): Promise<NoteEntity> {
    const currentNote = await this.getNoteById(noteId);
    const updatedTags = [
      ...currentNote.tags,
      NoteFactory.createNewTagValue({ name: tagName, userId }).values,
    ];
    const noteEntity = NoteFactory.createNoteEntity(
      currentNote.values,
      updatedTags
    );
    return this.noteRepository.update(noteEntity);
  }

  async removeTagFromNote(
    noteId: string,
    tagName: string,
    userId: string
  ): Promise<NoteEntity> {
    const currentNote = await this.getNoteById(noteId);
    const updatedTags = currentNote.tags.filter(
      (tag) => !(tag.userId === userId && tag.name === tagName)
    );
    const noteEntity = NoteFactory.createNoteEntity(
      currentNote.values,
      updatedTags
    );
    return this.noteRepository.update(noteEntity);
  }
}
