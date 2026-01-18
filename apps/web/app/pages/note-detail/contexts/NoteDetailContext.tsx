import { createContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { AxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import {
  useDeleteApiNotesId,
  useGetApiNotesId,
} from '@app/generated/web-api/default/default';
import { useSnackBar } from '@app/hooks/useSnackBar';
import { useAuth } from '@app/hooks/useAuth';
import { axiosErrorHandler } from '@app/lib/error/axios-error-handler';
import type { Note } from '@app/lib/notes/note-types';

// Context の型定義
interface NoteDetailContextValue {
  noteId?: string;
  note: Note | null;
  isLoading: boolean;
  error: unknown;
  isOwner: boolean;
  isDeleting: boolean;
  deleteNote: () => void;
}

// Context の作成
export const NoteDetailContext = createContext<NoteDetailContextValue | null>(
  null
);

// Provider コンポーネント
export function NoteDetailProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { showSnackBar } = useSnackBar();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const noteQuery = useGetApiNotesId(noteId ?? '', {
    query: {
      enabled: Boolean(noteId),
    },
  });

  const note = (noteQuery.data?.data ?? null) as Note | null;
  const isOwner = Boolean(user && note && user.id === note.userId);

  const deleteMutation = useDeleteApiNotesId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries();
        showSnackBar('ノートを削除しました', 'success');
        navigate('/home');
      },
      onError: (error: AxiosError) => {
        const { message } = axiosErrorHandler(error);
        showSnackBar(message, 'error');
      },
    },
  });

  const deleteNote = useCallback(() => {
    if (!noteId) {
      return;
    }

    deleteMutation.mutate({ id: noteId });
  }, [deleteMutation, noteId]);

  const value: NoteDetailContextValue = {
    noteId,
    note,
    isLoading: noteQuery.isPending,
    error: noteQuery.error,
    isOwner,
    isDeleting: deleteMutation.isPending,
    deleteNote,
  };

  return (
    <NoteDetailContext.Provider value={value}>
      {children}
    </NoteDetailContext.Provider>
  );
}
