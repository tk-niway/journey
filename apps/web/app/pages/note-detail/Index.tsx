import { BaseButton } from '@app/components/buttons/BaseButton';
import { LinkButton } from '@app/components/buttons/LinkButton';
import { CenteredLayout } from '@app/components/layouts/CenteredLayout';
import { BodyText } from '@app/components/texts/BodyText';
import { Description } from '@app/components/texts/Description';
import { Heading } from '@app/components/texts/Heading';
import { LabelText } from '@app/components/texts/LabelText';
import { LinkText } from '@app/components/texts/LinkText';
import {
  formatNoteDate,
  formatTagsLabel,
} from '@app/lib/notes/note-utils';
import { NoteDetailProvider } from './contexts/NoteDetailContext';
import { useNoteDetail } from './hooks/useNoteDetail';

export function meta() {
  return [
    { title: 'ノート詳細 - Journey' },
    { name: 'description', content: 'ノートの詳細を表示します' },
  ];
}

function NoteDetailContent() {
  const { note, isLoading, error, isOwner, deleteNote, isDeleting } =
    useNoteDetail();

  const handleDelete = () => {
    if (typeof window === 'undefined') {
      return;
    }

    const shouldDelete = window.confirm('このノートを削除しますか？');
    if (!shouldDelete) {
      return;
    }

    deleteNote();
  };

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

  return (
    <CenteredLayout maxWidth="xl">
      <div>
        <Heading className="mt-6 text-left">{note.title}</Heading>
        <Description className="mt-2 text-left">ノート詳細</Description>
      </div>
      <div className="mt-6 space-y-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <div className="space-y-2">
          <LabelText>タグ</LabelText>
          <BodyText size="sm" color="muted">
            {note.tags.length > 0 ? formatTagsLabel(note.tags) : 'タグなし'}
          </BodyText>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <LabelText>作成日時</LabelText>
            <BodyText size="sm" color="muted">
              {formatNoteDate(note.createdAt)}
            </BodyText>
          </div>
          <div>
            <LabelText>更新日時</LabelText>
            <BodyText size="sm" color="muted">
              {formatNoteDate(note.updatedAt)}
            </BodyText>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <BodyText className="whitespace-pre-wrap">{note.content}</BodyText>
      </div>
      <div className="flex flex-wrap gap-2">
        <LinkButton to="/home" variant="secondary" className="w-auto px-4">
          一覧へ戻る
        </LinkButton>
        {isOwner && (
          <>
            <LinkButton
              to={`/notes/${note.id}/edit`}
              className="w-auto px-4"
            >
              編集
            </LinkButton>
            <BaseButton
              variant="danger"
              className="w-auto px-4"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              削除
            </BaseButton>
          </>
        )}
      </div>
      {!isOwner && (
        <BodyText size="sm" color="muted">
          このノートは作成者のみ編集・削除できます
        </BodyText>
      )}
    </CenteredLayout>
  );
}

export default function NoteDetailPage() {
  return (
    <NoteDetailProvider>
      <NoteDetailContent />
    </NoteDetailProvider>
  );
}
