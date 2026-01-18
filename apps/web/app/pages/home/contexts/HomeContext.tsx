import { createContext, useCallback } from 'react';
import type { AxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@app/hooks/useAuth';
import type { PostApiUsersMe200 } from '@app/generated/web-api/model/postApiUsersMe200';
import {
  useDeleteApiNotesId,
  useGetApiNotes,
} from '@app/generated/web-api/default/default';
import { useSnackBar } from '@app/hooks/useSnackBar';
import { axiosErrorHandler } from '@app/lib/error/axios-error-handler';
import type { Note } from '@app/lib/notes/note-types';

// Context の型定義
interface HomeContextValue {
  user: PostApiUsersMe200 | null;
  isLoading: boolean;
  error: unknown;
  notes: Note[];
  isNotesLoading: boolean;
  notesError: unknown;
  isDeletingNote: boolean;
  deleteNote: (noteId: string) => void;
}

// Context の作成
export const HomeContext = createContext<HomeContextValue | null>(null);

// Provider コンポーネント
// AuthContextを使用してユーザー情報を取得
export function HomeProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading, error } = useAuth();
  const { showSnackBar } = useSnackBar();
  const queryClient = useQueryClient();
  const notesQuery = useGetApiNotes();

  const deleteNoteMutation = useDeleteApiNotesId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries();
        showSnackBar('ノートを削除しました', 'success');
      },
      onError: (deleteError: AxiosError) => {
        const { message } = axiosErrorHandler(deleteError);
        showSnackBar(message, 'error');
      },
    },
  });

  const deleteNote = useCallback(
    (noteId: string) => {
      if (!noteId) {
        return;
      }

      deleteNoteMutation.mutate({ id: noteId });
    },
    [deleteNoteMutation]
  );

  const notes = (notesQuery.data?.data ?? []) as Note[];

  const value: HomeContextValue = {
    user,
    isLoading,
    error,
    notes,
    isNotesLoading: notesQuery.isPending,
    notesError: notesQuery.error,
    isDeletingNote: deleteNoteMutation.isPending,
    deleteNote,
  };

  return <HomeContext.Provider value={value}>{children}</HomeContext.Provider>;
}
