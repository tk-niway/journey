import { DatabaseService } from '@db/database.service';
import { noteTagsTable } from '@db/schemas/note-tags-table.schema';
import { notesTable } from '@db/schemas/notes-table.schema';
import { tagsTable } from '@db/schemas/tags-table.schema';
import { NoteEntity } from '@domains/note/entities/note.entity';
import { NoteFactory } from '@domains/note/factories/note.factory';
import { NoteRepository } from '@domains/note/repositories/note-repository.interface';
import logger from '@lib/loggers';
import { eq } from 'drizzle-orm';
import {
  NoteCreateDbError,
  NoteCreateTransactionDbError,
  NoteUpdateTransactionDbError,
} from './notes-table.error';

export class NotesTableRepository implements NoteRepository {
  constructor(private readonly dbClient: DatabaseService) {}

  async findById(id: string): Promise<NoteEntity | null> {
    const note = await this.dbClient.query.notesTable.findFirst({
      where: eq(notesTable.id, id),
      with: {
        noteTags: {
          with: {
            tag: true,
          },
        },
      },
    });

    if (!note) return null;

    const tags = note.noteTags
      .map((noteTag) => noteTag.tag)
      .filter((tag): tag is NonNullable<typeof tag> => !!tag);

    return NoteFactory.createNoteEntity(note, tags);
  }

  async findManyByUserId(userId: string): Promise<NoteEntity[]> {
    const notes = await this.dbClient.query.notesTable.findMany({
      where: eq(notesTable.userId, userId),
      with: {
        noteTags: {
          with: {
            tag: true,
          },
        },
      },
    });

    return notes.map((note) => {
      const tags = note.noteTags
        .map((noteTag) => noteTag.tag)
        .filter((tag): tag is NonNullable<typeof tag> => !!tag);
      return NoteFactory.createNoteEntity(note, tags);
    });
  }

  async create(noteEntity: NoteEntity): Promise<NoteEntity> {
    const noteArgs = noteEntity.createNoteArgs();
    const tagArgs = noteEntity.createTagArgs();
    const noteTagArgs = noteEntity.createNoteTagArgs();

    try {
      return this.dbClient.transaction((db) => {
        const createNoteResult = db
          .insert(notesTable)
          .values(noteArgs)
          .returning()
          .all();

        const createdNote = createNoteResult[0];
        if (!createdNote) throw new NoteCreateDbError();

        const createdTags =
          tagArgs.length === 0
            ? []
            : db.insert(tagsTable).values(tagArgs).returning().all();

        if (noteTagArgs.length > 0) {
          db.insert(noteTagsTable).values(noteTagArgs).run();
        }

        return NoteFactory.createNoteEntity(createdNote, createdTags);
      });
    } catch (error) {
      logger.error(
        `${NotesTableRepository.name}:create`,
        `values:${JSON.stringify({ note: noteArgs, tags: tagArgs })}`,
        error
      );
      throw new NoteCreateTransactionDbError();
    }
  }

  async update(noteEntity: NoteEntity): Promise<NoteEntity> {
    const noteArgs = noteEntity.createNoteArgs();
    const tagArgs = noteEntity.createTagArgs();
    const noteTagArgs = noteEntity.createNoteTagArgs();

    try {
      return this.dbClient.transaction((db) => {
        const updatedNotes = db
          .update(notesTable)
          .set({
            title: noteArgs.title,
            content: noteArgs.content,
            userId: noteArgs.userId,
            // updatedAt はスキーマの $onUpdate に任せる
          })
          .where(eq(notesTable.id, noteArgs.id))
          .returning()
          .all();

        const updatedNote = updatedNotes[0];
        if (!updatedNote) {
          // ここはドメインエラーではなく、呼び出し側で「0件更新」を扱う想定
          throw new NoteUpdateTransactionDbError();
        }

        // 既存の関連を全削除して貼り直す
        db.delete(noteTagsTable)
          .where(eq(noteTagsTable.noteId, noteArgs.id))
          .run();

        if (tagArgs.length > 0) {
          // Tag は Note に集約されるが、DB上は共有されうるため、既存IDは挿入スキップする
          db.insert(tagsTable)
            .values(tagArgs)
            .onConflictDoNothing({ target: tagsTable.id })
            .run();
        }

        if (noteTagArgs.length > 0) {
          db.insert(noteTagsTable).values(noteTagArgs).run();
        }

        // Tag の取得は省略し、入力値（TagValueObject）で返す
        return NoteFactory.createNoteEntity(updatedNote, tagArgs);
      });
    } catch (error) {
      logger.error(
        `${NotesTableRepository.name}:update`,
        `values:${JSON.stringify({ note: noteArgs, tags: tagArgs })}`,
        error
      );
      throw new NoteUpdateTransactionDbError();
    }
  }

  async delete(id: string): Promise<void> {
    this.dbClient.delete(notesTable).where(eq(notesTable.id, id)).run();
  }
}
