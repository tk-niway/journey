import { type RouteConfig, index, route } from '@react-router/dev/routes';

// ルートの認証要件を定義（参考用）
// 各ルートファイルで route-loaders.ts の関数を使用して clientLoader を実装する
// index: 'guest' - 未ログインユーザーのみ
// home: 'auth' - ログインユーザーのみ
// signup: 'guest' - 未ログインユーザーのみ
// signin: 'guest' - 未ログインユーザーのみ
// 'home/:id': 'auth' - ログインユーザーのみ

export default [
  index('pages/guest/Index.tsx'),
  route('home', 'pages/home/Index.tsx'),
  route('signup', 'pages/signup/Index.tsx'),
  route('signin', 'pages/signin/Index.tsx'),
  route('home/:id', 'routes/home2.tsx'),
] satisfies RouteConfig;
