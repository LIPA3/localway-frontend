import { index, route } from "@react-router/dev/routes";

/**
 * @type {import("@react-router/dev").RouteConfig} RouteConfig
 */
const routes = [
  index("routes/Home.jsx"),
  route("posts/:id", "routes/posts.$id.jsx"),
];

export default routes;
