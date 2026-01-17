import { createContext, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetApiNotesId,
  usePatchApiNotesId,
} from '@app/generated/web-api/default/default';
import type { PatchApiNotesIdBody } from '@app/generated/web-api/model/patchApiNotesIdBody';
import { useSnackBar } from '@app/hooks/useSnackBar';
import { useAuth } from '@app/hooks/useAuth';
import {
  axiosErrorHandler,
  setFormValidationErrors,
} from '@app/lib/error/axios-error-handler';
import type { Note } from '@app/lib/notes/note-types';
import z from 'zod';

/** ノート編集フォームのスキーマ */
export const noteEditFormSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルを入力してください')
    .max(128, 'タイトルは128文字以内で入力してください'),
  content: z
    .string()
    .min(1, '内容を入力してください')
    .max(20000, '内容は20000文字以内で入力してください'),
});

/** ノート編集フォームの型 */
export type NoteEditFormData = z.infer<typeof noteEditFormSchema>;

// Context の型定義
interface NoteEditContextValue {
  form: UseFormReturn<NoteEditFormData>;
  updateMutation: ReturnType<typeof usePatchApiNotesId>;
  note: Note | null;
  isLoading: boolean;
  error: unknown;
  isOwner: boolean;
  onSubmit: (data: NoteEditFormData) => void;
}

// Context の作成
export const NoteEditContext =
  createContext<NoteEditContextValue | null>(null);

// Provider コンポーネント
export function NoteEditProvider({
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

  // react-hook-form の設定（zod スキーマを使用）
  const form = useForm<NoteEditFormData>({
    resolver: zodResolver(noteEditFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      content: '',
    },
  });

  const { setError, reset } = form;

  useEffect(() => {
    if (!note) {
      return;
    }

    reset({
      title: note.title,
      content: note.content,
    });
  }, [note, reset]);

  const updateMutation = usePatchApiNotesId({
    mutation: {
      onSuccess: (response) => {
        queryClient.invalidateQueries();
        const updatedNote = response.data;
        showSnackBar('ノートを更新しました', 'success');
        if (updatedNote?.id) {
          navigate(`/notes/${updatedNote.id}`);
          return;
        }
        if (noteId) {
          navigate(`/notes/${noteId}`);
          return;
        }
        navigate('/home');
      },
      onError: (error: AxiosError) => {
        const { message, validationErrors } = axiosErrorHandler(error);
        setFormValidationErrors(validationErrors, setError, [
          'title',
          'content',
        ] as const);
        showSnackBar(message, 'error');
      },
    },
  });

  // フォーム送信処理
  const onSubmit = useCallback(
    (data: NoteEditFormData) => {
      if (!noteId) {
        return;
      }

      const noteData: PatchApiNotesIdBody = {
        title: data.title,
        content: data.content,
      };
      updateMutation.mutate({ id: noteId, data: noteData });
    },
    [noteId, updateMutation]
  );

  const value: NoteEditContextValue = {
    form,
    updateMutation,
    note,
    isLoading: noteQuery.isPending,
    error: noteQuery.error,
    isOwner,
    onSubmit,
  };

  return (
    <NoteEditContext.Provider value={value}>
      {children}
    </NoteEditContext.Provider>
  );
}
