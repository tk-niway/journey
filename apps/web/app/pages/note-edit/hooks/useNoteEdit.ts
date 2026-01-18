import { useContext } from 'react';
import { NoteEditContext } from '../contexts/NoteEditContext';

/**
 * ノート編集ページの context を使用するカスタムフック
 * @throws {Error} NoteEditProvider の外で使用された場合
 */
export function useNoteEdit() {
  const context = useContext(NoteEditContext);
  if (!context) {
    throw new Error('useNoteEdit must be used within NoteEditProvider');
  }
  return context;
}
