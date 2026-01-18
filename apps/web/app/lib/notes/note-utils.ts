import type { NoteTag } from './note-types';

export const parseTagsInput = (value: string): string[] => {
  return Array.from(
    new Set(
      value
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
    )
  );
};

export const isValidTagsInput = (value?: string): boolean => {
  if (!value) {
    return true;
  }

  return parseTagsInput(value).every((tag) => tag.length <= 128);
};

export const formatTagsLabel = (tags: NoteTag[]): string => {
  return tags.map((tag) => tag.name).join(', ');
};

export const truncateText = (value: string, maxLength: number): string => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength)}...`;
};

export const formatNoteDate = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString('ja-JP');
};
