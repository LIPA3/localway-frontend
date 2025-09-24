import { index, route } from "@react-router/dev/routes";

/**
 * @type {import("@react-router/dev").RouteConfig} RouteConfig
 */
const routes = [
  index("routes/Home.jsx"),
  route("posts/:id", "routes/posts.$id.jsx"),
  route("/creatorCenter", "routes/CreatorPage.jsx"),
  route("/createArticle", "routes/CreateArticle.jsx"),
  route("/smartRecommend", "routes/SmartRecommend.jsx"),
  route("/smartRecommend/result", "routes/SmartRecommendResult.jsx"),
  route("/savedPlan", "routes/SavedPlan.jsx"),
];

export default routes;
