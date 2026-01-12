import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { getApiUsersId } from "@generated/web-api/default/default";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader({ params }: { params: { id: string } }) {
  const response = await getApiUsersId(params.id);
  return response.data;
}

export function HydrateFallback() {
  return <div>Loading...</div>;
}

export default function Home({ loaderData }: { loaderData: any }) {
  return <Welcome loaderData={loaderData} />;
}
