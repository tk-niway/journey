import { faker } from '@faker-js/faker';
import { NoteEntity } from '@domains/note/entities/note.entity';
import { NoteFactory } from '@domains/note/factories/note.factory';

export class NoteTestFactory {
  private constructor() {}

  static createNoteEntity(args?: {
    userId?: string;
    title?: string;
    content?: string;
    tagNames?: string[];
  }): NoteEntity {
    const userId = args?.userId ?? faker.string.nanoid();
    const title = args?.title ?? faker.lorem.words({ min: 1, max: 3 });
    const content = args?.content ?? faker.lorem.paragraph();
    const tagNames = args?.tagNames ?? ['テストタグ'];

    const noteValue = NoteFactory.createNewNoteValue({
      userId,
      title,
      content,
    });

    const tags = tagNames.map((name) =>
      NoteFactory.createNewTagValue({ name })
    );

    return NoteFactory.createNoteEntity(noteValue, tags);
  }
}
