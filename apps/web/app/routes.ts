import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("home/:id", "routes/home2.tsx"),
  route("signup", "pages/signup/index.tsx"),
] satisfies RouteConfig;
