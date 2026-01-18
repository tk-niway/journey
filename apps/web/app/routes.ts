import {
  type RouteConfig,
  index,
  route,
  layout,
} from '@react-router/dev/routes';

/**
 * ルート定義
 *
 * - _auth/layout.tsx 配下: 認証必須ルート（未認証 → /signin へリダイレクト）
 * - _guest/layout.tsx 配下: ゲスト専用ルート（認証済み → /home へリダイレクト）
 * - それ以外: 認証不要（誰でもアクセス可能）
 */
export default [
  // ゲスト専用ルート（未認証ユーザーのみアクセス可能）
  layout('routes/_guest/layout.tsx', [
    index('pages/guest/Index.tsx'),
    route('signup', 'pages/signup/Index.tsx'),
    route('signin', 'pages/signin/Index.tsx'),
  ]),

  // 認証必須ルート（ログインユーザーのみアクセス可能）
  layout('routes/_auth/layout.tsx', [
    route('home', 'pages/home/Index.tsx'),
    route('notes/new', 'pages/note-create/Index.tsx'),
    route('notes/:noteId/edit', 'pages/note-edit/Index.tsx'),
    route('notes/:noteId', 'pages/note-detail/Index.tsx'),
  ]),
] satisfies RouteConfig;
