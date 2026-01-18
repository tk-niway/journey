import { createContext, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { usePostApiNotes } from '@app/generated/web-api/default/default';
import type { PostApiNotesBody } from '@app/generated/web-api/model/postApiNotesBody';
import { useSnackBar } from '@app/hooks/useSnackBar';
import {
  axiosErrorHandler,
  setFormValidationErrors,
} from '@app/lib/error/axios-error-handler';
import { isValidTagsInput, parseTagsInput } from '@app/lib/notes/note-utils';
import z from 'zod';

/** ノート作成フォームのスキーマ */
export const noteCreateFormSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルを入力してください')
    .max(128, 'タイトルは128文字以内で入力してください'),
  content: z
    .string()
    .min(1, '内容を入力してください')
    .max(20000, '内容は20000文字以内で入力してください'),
  tags: z
    .string()
    .optional()
    .refine((value) => isValidTagsInput(value), {
      message: 'タグは1つ128文字以内で入力してください',
    }),
});

/** ノート作成フォームの型 */
export type NoteCreateFormData = z.infer<typeof noteCreateFormSchema>;

// Context の型定義
interface NoteCreateContextValue {
  form: UseFormReturn<NoteCreateFormData>;
  createMutation: ReturnType<typeof usePostApiNotes>;
  onSubmit: (data: NoteCreateFormData) => void;
}

// Context の作成
export const NoteCreateContext = createContext<NoteCreateContextValue | null>(
  null
);

// Provider コンポーネント
export function NoteCreateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { showSnackBar } = useSnackBar();
  const queryClient = useQueryClient();

  // react-hook-form の設定（zod スキーマを使用）
  const form = useForm<NoteCreateFormData>({
    resolver: zodResolver(noteCreateFormSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      content: '',
      tags: '',
    },
  });

  const { setError } = form;

  const createMutation = usePostApiNotes({
    mutation: {
      onSuccess: (response) => {
        queryClient.invalidateQueries();
        const createdNote = response.data;
        showSnackBar('ノートを作成しました', 'success');
        if (createdNote?.id) {
          navigate(`/notes/${createdNote.id}`);
          return;
        }
        navigate('/home');
      },
      onError: (error: AxiosError) => {
        const { message, validationErrors } = axiosErrorHandler(error);
        setFormValidationErrors(validationErrors, setError, [
          'title',
          'content',
          'tags',
        ] as const);
        showSnackBar(message, 'error');
      },
    },
  });

  // フォーム送信処理
  const onSubmit = useCallback(
    (data: NoteCreateFormData) => {
      const tags = parseTagsInput(data.tags ?? '');
      const noteData: PostApiNotesBody = {
        title: data.title,
        content: data.content,
        ...(tags.length > 0 ? { tags } : {}),
      };
      createMutation.mutate({ data: noteData });
    },
    [createMutation]
  );

  const value: NoteCreateContextValue = {
    form,
    createMutation,
    onSubmit,
  };

  return (
    <NoteCreateContext.Provider value={value}>
      {children}
    </NoteCreateContext.Provider>
  );
}
