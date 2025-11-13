import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("users", "routes/users.tsx"),
  route("games/truthordare", "routes/games/truthordare.tsx"),
  route("games/undercover", "routes/games/undercover.tsx"),
] satisfies RouteConfig;
 