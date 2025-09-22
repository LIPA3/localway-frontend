import { index, route } from "@react-router/dev/routes";

/**
 * @type {import("@react-router/dev").RouteConfig} RouteConfig
 */
const routes = [
  index("routes/Home.jsx"),
  route("/creatorCenter", "routes/CreatorPage.jsx"),
  route("/createArticle", "routes/CreateArticle.jsx"),
];

export default routes;
