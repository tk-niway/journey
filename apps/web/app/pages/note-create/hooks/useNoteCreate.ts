import { useContext } from 'react';
import { NoteCreateContext } from '../contexts/NoteCreateContext';

/**
 * ノート作成ページの context を使用するカスタムフック
 * @throws {Error} NoteCreateProvider の外で使用された場合
 */
export function useNoteCreate() {
  const context = useContext(NoteCreateContext);
  if (!context) {
    throw new Error('useNoteCreate must be used within NoteCreateProvider');
  }
  return context;
}
