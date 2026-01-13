import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('pages/guest/Index.tsx'),
  route('home', 'pages/home/Index.tsx'),
  route('signup', 'pages/signup/Index.tsx'),
  route('signin', 'pages/signin/Index.tsx'),
  route('home/:id', 'routes/home2.tsx'),
] satisfies RouteConfig;
