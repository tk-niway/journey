import type { Route } from './+types/home2';
import { Welcome } from '../welcome/welcome';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

import { getApiUsersId } from '@generated/web-api/default/default';
import { authLoaderWithData } from '@lib/auth/route-loaders';

export async function clientLoader({ params }: { params: { id: string } }) {
  return authLoaderWithData(async () => {
    const response = await getApiUsersId(params.id);
    return response.data;
  });
}

export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function Home({ loaderData }: { loaderData: any }) {
  return <Welcome loaderData={loaderData} />;
}
