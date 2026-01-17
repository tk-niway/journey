import { Heading } from '@app/components/texts/Heading';
import { Description } from '@app/components/texts/Description';
import { BodyText } from '@app/components/texts/BodyText';
import { LabelText } from '@app/components/texts/LabelText';
import { CenteredLayout } from '@app/components/layouts/CenteredLayout';
import { LinkButton } from '@app/components/buttons/LinkButton';
import { BaseButton } from '@app/components/buttons/BaseButton';
import { LinkText } from '@app/components/texts/LinkText';
import { HomeProvider } from './contexts/HomeContext';
import { useHome } from './hooks/useHome';
import type { Note } from '@app/lib/notes/note-types';
import { formatTagsLabel, truncateText } from '@app/lib/notes/note-utils';

export function meta() {
  return [
    { title: 'ホーム - Journey' },
    { name: 'description', content: 'ユーザー情報を表示します' },
  ];
}

function HomeContent() {
  const {
    user,
    error,
    notes,
    isNotesLoading,
    notesError,
    deleteNote,
    isDeletingNote,
  } = useHome();

  if (error || !user) {
    return (
      <CenteredLayout>
        <div className="text-center">
          <BodyText color="error">ユーザー情報の取得に失敗しました</BodyText>
        </div>
      </CenteredLayout>
    );
  }

  return (
    <CenteredLayout maxWidth="xl">
      <div>
        <Heading className="mt-6">ホーム</Heading>
        <Description className="mt-2">ユーザー情報</Description>
      </div>
      <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
        <div>
          <LabelText>名前</LabelText>
          <BodyText size="lg" className="mt-1">
            {user.name}
          </BodyText>
        </div>
        <div>
          <LabelText>メールアドレス</LabelText>
          <BodyText size="lg" className="mt-1">
            {user.email}
          </BodyText>
        </div>
      </div>
      <section className="mt-10 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Heading level={3} className="text-left">
              ノート
            </Heading>
            <Description className="mt-2 text-left">
              作成したノート一覧
            </Description>
          </div>
          <LinkButton to="/notes/new" className="w-auto px-4">
            ノートを作成
          </LinkButton>
        </div>
        <NoteList
          notes={notes}
          isLoading={isNotesLoading}
          error={notesError}
          currentUserId={user.id}
          onDelete={deleteNote}
          isDeleting={isDeletingNote}
        />
      </section>
    </CenteredLayout>
  );
}

interface NoteListProps {
  notes: Note[];
  isLoading: boolean;
  error: unknown;
  currentUserId?: string;
  onDelete: (noteId: string) => void;
  isDeleting: boolean;
}

function NoteList({
  notes,
  isLoading,
  error,
  currentUserId,
  onDelete,
  isDeleting,
}: NoteListProps) {
  const handleDelete = (noteId: string) => {
    if (typeof window === 'undefined') {
      return;
    }

    const shouldDelete = window.confirm('このノートを削除しますか？');
    if (!shouldDelete) {
      return;
    }

    onDelete(noteId);
  };

  if (isLoading) {
    return <BodyText color="muted">ノートを読み込み中...</BodyText>;
  }

  if (error) {
    return (
      <BodyText color="error">ノートの取得に失敗しました</BodyText>
    );
  }

  if (notes.length === 0) {
    return <BodyText color="muted">まだノートがありません</BodyText>;
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => {
        const isOwner = currentUserId === note.userId;
        return (
          <div
            key={note.id}
            className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <LinkText to={`/notes/${note.id}`} className="text-base">
                  {note.title}
                </LinkText>
                <BodyText size="sm" color="muted" className="whitespace-pre-wrap">
                  {truncateText(note.content, 120)}
                </BodyText>
                {note.tags.length > 0 && (
                  <BodyText size="sm" color="muted">
                    タグ: {formatTagsLabel(note.tags)}
                  </BodyText>
                )}
              </div>
              {isOwner && (
                <div className="flex flex-wrap gap-2">
                  <LinkButton
                    to={`/notes/${note.id}/edit`}
                    variant="secondary"
                    className="w-auto px-4"
                  >
                    編集
                  </LinkButton>
                  <BaseButton
                    variant="danger"
                    className="w-auto px-4"
                    onClick={() => handleDelete(note.id)}
                    isLoading={isDeleting}
                  >
                    削除
                  </BaseButton>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  return (
    <HomeProvider>
      <HomeContent />
    </HomeProvider>
  );
}
