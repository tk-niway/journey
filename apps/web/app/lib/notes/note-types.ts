export interface NoteTag {
  id: string;
  name: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  tags: NoteTag[];
  createdAt: string;
  updatedAt: string;
}
