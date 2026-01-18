import { BaseButton } from '@app/components/buttons/BaseButton';
import { InputText } from '@app/components/inputs/InputText';
import { TextArea } from '@app/components/inputs/TextArea';
import { CenteredLayout } from '@app/components/layouts/CenteredLayout';
import { BodyText } from '@app/components/texts/BodyText';
import { Description } from '@app/components/texts/Description';
import { Heading } from '@app/components/texts/Heading';
import { LinkText } from '@app/components/texts/LinkText';
import { NoteCreateProvider } from './contexts/NoteCreateContext';
import { useNoteCreate } from './hooks/useNoteCreate';

export function meta() {
  return [
    { title: 'ノート作成 - Journey' },
    { name: 'description', content: '新しいノートを作成します' },
  ];
}

function NoteCreateForm() {
  const { form, createMutation, onSubmit } = useNoteCreate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <CenteredLayout maxWidth="xl">
      <div>
        <Heading className="mt-6">ノートを作成</Heading>
        <Description className="mt-2">
          新しいノートを作成して保存します
        </Description>
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
          <div className="space-y-2">
            <InputText
              label="タグ（任意）"
              type="text"
              placeholder="例: 日記, 仕事"
              error={errors.tags}
              {...register('tags')}
            />
            <BodyText size="sm" color="muted">
              タグはカンマ区切りで入力してください
            </BodyText>
          </div>
        </div>

        <div>
          <BaseButton
            type="submit"
            isLoading={isSubmitting || createMutation.isPending}
          >
            保存する
          </BaseButton>
        </div>

        <div className="text-center">
          <LinkText to="/home">ホームに戻る</LinkText>
        </div>
      </form>
    </CenteredLayout>
  );
}

export default function NoteCreatePage() {
  return (
    <NoteCreateProvider>
      <NoteCreateForm />
    </NoteCreateProvider>
  );
}
