import { useContext } from 'react';
import { NoteDetailContext } from '../contexts/NoteDetailContext';

/**
 * ノート詳細ページの context を使用するカスタムフック
 * @throws {Error} NoteDetailProvider の外で使用された場合
 */
export function useNoteDetail() {
  const context = useContext(NoteDetailContext);
  if (!context) {
    throw new Error('useNoteDetail must be used within NoteDetailProvider');
  }
  return context;
}
