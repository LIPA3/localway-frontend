import { RecommendedPostsPage } from "../components/homePage/RecommendedPostsPage";
import { Link } from "react-router";
import { Button } from "../components/ui/Button";
import "../css/HomePage.css";

export default function Home() {
  return (
    <div className="home-page">
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Link to="/creatorCenter">
          <Button
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm border-border hover:bg-accent"
          >
            创作者中心
          </Button>
        </Link>
        <Link to="/createArticle">
          <Button
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm border-border hover:bg-accent"
          >
            创建文章
          </Button>
        </Link>
      </div>
      <div className="content">
        <RecommendedPostsPage />
      </div>
    </div>
  );
}
