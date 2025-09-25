import { RecommendedPostsPage } from "../components/homePage/RecommendedPostsPage";
import { Link } from "react-router";
import { Button } from "../components/ui/Button";
import "../css/HomePage.css";
import AIChat from "../components/smartPage/AiChat";
import { useState } from "react";

export default function Home() {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  return (
    <div className="home-page">
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Link to="/smartRecommend">
          <Button
            variant="default"
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg backdrop-blur-sm"
          >
            智能出行
          </Button>
        </Link>
        <Link to="/savedPlan">
          <Button
            variant="default"
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg backdrop-blur-sm"
          >
            我的旅游计划
          </Button>
        </Link>
        <Link to="/creatorCenter">
          <Button
            variant="default"
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg backdrop-blur-sm"
          >
            创作者中心
          </Button>
        </Link>
        <Link to="/createArticle">
          <Button
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 shadow-md"
          >
            创建文章
          </Button>
        </Link>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                onClick={() => setIsAIChatOpen(true)}
              >
                ai客服 
              </Button>
      </div>
      <div className="content">
        <RecommendedPostsPage />
      </div>
      <AIChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </div>
  );
}
