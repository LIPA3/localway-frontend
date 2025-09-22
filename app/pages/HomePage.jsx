import { RecommendedPostsPage } from "../components/homePage/RecommendedPostsPage";
import { Link } from "react-router";
import { Button } from "../components/ui/Button";

export default function Home() {
  return (
    <div>
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Link href="/search">
          <Button
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm border-border hover:bg-accent"
          >
            搜索达人
          </Button>
        </Link>
        <Link href="/creator-profile">
          <Button
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm border-border hover:bg-accent"
          >
            创作者中心
          </Button>
        </Link>
        <Link href="/creator-edit">
          <Button
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm border-border hover:bg-accent"
          >
            编辑内容
          </Button>
        </Link>
        <Link href="/create">
          <Button
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm border-border hover:bg-accent"
          >
            创建内容
          </Button>
        </Link>
        <Link href="/posts">
          <Button
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm border-border hover:bg-accent"
          >
            浏览推荐
          </Button>
        </Link>
      </div>
      {/* <RecommendedPostsPage /> */}
    </div>
  );
}
