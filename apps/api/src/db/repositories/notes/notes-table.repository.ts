import { DatabaseService } from '@db/database.service';
import { noteTagsTable } from '@db/schemas/note-tags-table.schema';
import { notesTable } from '@db/schemas/notes-table.schema';
import { tagsTable } from '@db/schemas/tags-table.schema';
import { NoteEntity } from '@domains/note/entities/note.entity';
import { NoteFactory } from '@domains/note/factories/note.factory';
import { NoteRepository } from '@domains/note/repositories/note-repository.interface';
import logger from '@lib/loggers';
import { and, eq, inArray } from 'drizzle-orm';
import {
  NoteCreateDbError,
  NoteCreateTransactionDbError,
  NoteUpdateTransactionDbError,
} from './notes-table.error';

const uniq = <T>(values: T[]): T[] => Array.from(new Set(values));

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
    const tagNames = uniq(noteEntity.tags.map((tag) => tag.name));

    try {
      return this.dbClient.transaction((db) => {
        const createNoteResult = db
          .insert(notesTable)
          .values(noteArgs)
          .returning()
          .all();

        const createdNote = createNoteResult[0];
        if (!createdNote) throw new NoteCreateDbError();

        if (tagNames.length === 0) {
          return NoteFactory.createNoteEntity(createdNote, []);
        }

        // (userId, name) のユニーク制約により、同一ユーザー内の同名タグは重複作成されない
        db.insert(tagsTable)
          .values(
            tagNames.map((name) => ({
              name,
              userId: noteArgs.userId,
            }))
          )
          .onConflictDoNothing({
            target: [tagsTable.userId, tagsTable.name],
          })
          .run();

        const tags = db
          .select()
          .from(tagsTable)
          .where(
            and(
              eq(tagsTable.userId, noteArgs.userId),
              inArray(tagsTable.name, tagNames)
            )
          )
          .all();

        db.insert(noteTagsTable)
          .values(
            tags.map((tag) => ({ noteId: createdNote.id, tagId: tag.id }))
          )
          .run();

        return NoteFactory.createNoteEntity(createdNote, tags);
      });
    } catch (error) {
      logger.error(
        `${NotesTableRepository.name}:create`,
        `values:${JSON.stringify({ note: noteArgs, tagNames })}`,
        error
      );
      throw new NoteCreateTransactionDbError();
    }
  }

  async update(noteEntity: NoteEntity): Promise<NoteEntity> {
    const noteArgs = noteEntity.createNoteArgs();
    const tagNames = uniq(noteEntity.tags.map((tag) => tag.name));

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

        if (tagNames.length === 0) {
          return NoteFactory.createNoteEntity(updatedNote, []);
        }

        db.insert(tagsTable)
          .values(
            tagNames.map((name) => ({
              name,
              userId: noteArgs.userId,
            }))
          )
          .onConflictDoNothing({
            target: [tagsTable.userId, tagsTable.name],
          })
          .run();

        const tags = db
          .select()
          .from(tagsTable)
          .where(
            and(
              eq(tagsTable.userId, noteArgs.userId),
              inArray(tagsTable.name, tagNames)
            )
          )
          .all();

        db.insert(noteTagsTable)
          .values(
            tags.map((tag) => ({ noteId: updatedNote.id, tagId: tag.id }))
          )
          .run();

        return NoteFactory.createNoteEntity(updatedNote, tags);
      });
    } catch (error) {
      logger.error(
        `${NotesTableRepository.name}:update`,
        `values:${JSON.stringify({ note: noteArgs, tagNames })}`,
        error
      );
      throw new NoteUpdateTransactionDbError();
    }
  }

  async delete(id: string): Promise<void> {
    this.dbClient.delete(notesTable).where(eq(notesTable.id, id)).run();
  }
}
