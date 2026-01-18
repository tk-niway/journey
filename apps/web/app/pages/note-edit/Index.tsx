import { BaseButton } from '@app/components/buttons/BaseButton';
import { InputText } from '@app/components/inputs/InputText';
import { TextArea } from '@app/components/inputs/TextArea';
import { CenteredLayout } from '@app/components/layouts/CenteredLayout';
import { BodyText } from '@app/components/texts/BodyText';
import { Description } from '@app/components/texts/Description';
import { Heading } from '@app/components/texts/Heading';
import { LabelText } from '@app/components/texts/LabelText';
import { LinkText } from '@app/components/texts/LinkText';
import { formatTagsLabel } from '@app/lib/notes/note-utils';
import { NoteEditProvider } from './contexts/NoteEditContext';
import { useNoteEdit } from './hooks/useNoteEdit';

export function meta() {
  return [
    { title: 'ノート編集 - Journey' },
    { name: 'description', content: 'ノートを編集します' },
  ];
}

function NoteEditForm() {
  const { form, updateMutation, onSubmit, note, isLoading, error, isOwner } =
    useNoteEdit();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  if (isLoading) {
    return (
      <CenteredLayout maxWidth="xl">
        <BodyText color="muted">ノートを読み込み中...</BodyText>
      </CenteredLayout>
    );
  }

  if (error || !note) {
    return (
      <CenteredLayout maxWidth="xl">
        <BodyText color="error">ノートの取得に失敗しました</BodyText>
        <div className="text-center">
          <LinkText to="/home">ホームに戻る</LinkText>
        </div>
      </CenteredLayout>
    );
  }

  if (!isOwner) {
    return (
      <CenteredLayout maxWidth="xl">
        <BodyText color="error">このノートは作成者のみ編集できます</BodyText>
        <div className="text-center">
          <LinkText to={`/notes/${note.id}`}>ノート詳細に戻る</LinkText>
        </div>
      </CenteredLayout>
    );
  }

  return (
    <CenteredLayout maxWidth="xl">
      <div>
        <Heading className="mt-6">ノートを編集</Heading>
        <Description className="mt-2">タイトルと内容を更新します</Description>
      </div>
      <div className="mt-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <div className="space-y-2">
          <LabelText>現在のタグ</LabelText>
          <BodyText size="sm" color="muted">
            {note.tags.length > 0 ? formatTagsLabel(note.tags) : 'タグなし'}
          </BodyText>
        </div>
      </div>
      <form
        className="mt-8 space-y-6"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="space-y-4 rounded-md shadow-sm">
          <InputText
            label="タイトル"
            type="text"
            placeholder="ノートのタイトル"
            error={errors.title}
            {...register('title')}
          />
          <TextArea
            label="内容"
            rows={10}
            placeholder="ノートの内容を入力してください"
            error={errors.content}
            {...register('content')}
          />
        </div>

        <div>
          <BaseButton
            type="submit"
            isLoading={isSubmitting || updateMutation.isPending}
          >
            更新する
          </BaseButton>
        </div>

        <div className="text-center">
          <LinkText to={`/notes/${note.id}`}>ノート詳細に戻る</LinkText>
        </div>
      </form>
    </CenteredLayout>
  );
}

export default function NoteEditPage() {
  return (
    <NoteEditProvider>
      <NoteEditForm />
    </NoteEditProvider>
  );
}
