import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  Heart,
  MessageCircle,
  MapPin,
  Search,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { useArticles, useToggleArticleLike } from "../../hooks/useApi";

// DEMO DATA
const recommendedPosts = [
  {
    article_id: 1,
    creator_id: 101,
    title: "广州老城区的咖啡文化探索",
    address: "广州市荔湾区恩宁路",
    content:
      "带你走进广州老城区的咖啡文化世界，探索那些隐藏在小巷中的独特咖啡店，了解每一杯咖啡背后的历史故事...",
    image: "/guangzhou-coffee-culture.jpg",
    video: null,
    likes_num: 234,
    comments_num: 45,
    create_time: "2024-12-20T10:00:00Z",
    update_time: "2024-12-20T10:00:00Z",
    is_deleted: 0,
    author: {
      name: "Ale Chen",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uilN86FuKAmS6s2N3SbfVfcxjEYkui.png",
      location: "广州",
      isVerified: true,
    },
    category: "咖啡文化",
    tags: ["咖啡", "历史", "本地文化", "老城区", "地道", "本地化"],
    isLiked: false,
  },
  {
    article_id: 2,
    creator_id: 102,
    title: "上海弄堂里的传统手工艺",
    address: "上海市黄浦区田子坊",
    content:
      "在上海的老弄堂中，依然保留着许多传统手工艺。跟随我一起探访这些匠人，学习传统技艺，感受老上海的文化底蕴...",
    image: "/shanghai-traditional-crafts.jpg",
    video: null,
    likes_num: 189,
    comments_num: 32,
    create_time: "2024-12-20T07:00:00Z",
    update_time: "2024-12-20T07:00:00Z",
    is_deleted: 0,
    author: {
      name: "Lin Xiaoyang",
      avatar:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HMT2n5SvrbOoz4UrfQfDP9FTLRxWK2.png",
      location: "上海",
      isVerified: true,
    },
    category: "传统手工",
    tags: ["手工艺", "传统文化", "弄堂", "匠人", "地道", "本地化"],
    isLiked: true,
  },
  {
    article_id: 3,
    creator_id: 103,
    title: "北京胡同里的美食寻味之旅",
    address: "北京市东城区南锣鼓巷",
    content:
      "走进北京的胡同深处，寻找那些只有老北京人才知道的美食秘密。从传统小吃到创新料理，每一口都是历史的味道...",
    image: "/beijing-hutong-food.jpg",
    video: null,
    likes_num: 312,
    comments_num: 78,
    create_time: "2024-12-19T14:00:00Z",
    update_time: "2024-12-19T14:00:00Z",
    is_deleted: 0,
    author: {
      name: "王明",
      avatar: "/beijing-local-expert.jpg",
      location: "北京",
      isVerified: false,
    },
    category: "美食文化",
    tags: ["美食", "胡同", "传统小吃", "北京", "地道", "本地化"],
    isLiked: false,
  },
  {
    article_id: 4,
    creator_id: 104,
    title: "成都茶馆文化深度体验",
    address: "成都市青羊区宽窄巷子",
    content:
      "在成都的传统茶馆中，感受慢生活的节奏。学习茶艺，听老茶客讲述成都的变迁，体验最地道的成都文化...",
    image: "/chengdu-teahouse-culture.jpg",
    video: null,
    likes_num: 156,
    comments_num: 28,
    create_time: "2024-12-18T16:00:00Z",
    update_time: "2024-12-18T16:00:00Z",
    is_deleted: 0,
    author: {
      name: "李小花",
      avatar: "/chengdu-food-expert.jpg",
      location: "成都",
      isVerified: true,
    },
    category: "茶文化",
    tags: ["茶文化", "慢生活", "传统", "成都", "地道", "本地化"],
    isLiked: false,
  },
  {
    article_id: 5,
    creator_id: 105,
    title: "西安古城墙下的历史漫步",
    address: "西安市碑林区南门",
    content:
      "沿着西安古城墙，聆听千年古都的历史回响。从唐朝的繁华到现代的变迁，每一块砖石都诉说着不同的故事...",
    image: "/xian-ancient-wall.jpg",
    video: null,
    likes_num: 278,
    comments_num: 56,
    create_time: "2024-12-17T11:00:00Z",
    update_time: "2024-12-17T11:00:00Z",
    is_deleted: 0,
    author: {
      name: "张历史",
      avatar: "/xian-history-expert.jpg",
      location: "西安",
      isVerified: true,
    },
    category: "历史文化",
    tags: ["历史", "古城墙", "唐朝", "西安", "地道", "本地化"],
    isLiked: true,
  },
];

export function RecommendedPostsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page] = useState(0);
  const [size] = useState(20);

  // Use TanStack Query to fetch articles
  const {
    data: articles = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useArticles(page, size, searchQuery);

  const toggleArticleLikeMutation = useToggleArticleLike();

  // Search with debouncing could be added here
  useEffect(() => {
    // Could add debounced search logic here
  }, [searchQuery]);

  const handleLike = (articleId, event) => {
    event.preventDefault();
    event.stopPropagation();

    toggleArticleLikeMutation.mutate({
      articleId,
      likeData: { userId: 1 }, // Replace with actual user ID
    });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <RefreshCw className="w-5 h-5 animate-spin" />
          正在加载文章...
        </div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            加载失败: {error?.message || "未知错误"}
          </p>
          <Button onClick={() => refetch()}>重试</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">LocalWay</h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="搜索体验、地点或达人..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6">
          {articles.map((article) => (
            <Link
              key={article.articleId}
              to={`/posts/${article.articleId}`}
              className="block"
            >
              <Card className="post-card border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-0">
                  <div className="md:flex">
                    {/* Image */}
                    <div className="md:w-80 h-64 md:h-auto relative">
                      <img
                        src={
                          article.image ||
                          "/placeholder.svg?height=300&width=400"
                        }
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-primary/90 text-primary-foreground">
                          {article.tagList?.[0]?.name || "体验"}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                      {/* Author Info - Note: Backend doesn't provide author info, using placeholder */}
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src="/placeholder.svg" alt="Author" />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-card-foreground">
                              Creator #{article.creatorId || "Unknown"}
                            </h4>
                            <Badge variant="secondary" className="text-xs">
                              认证
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {article.address || "位置未知"}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          最近发布
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="mb-4">
                        <h2 className="text-xl font-bold text-card-foreground mb-2 text-balance">
                          {article.title}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed line-clamp-3 text-pretty">
                          {article.content}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tagList?.map((tag) => (
                          <Badge
                            key={tag.tagId}
                            variant="outline"
                            className="text-xs border-muted"
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>

                      {/* Experience Details */}
                      <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {article.address || "地址未提供"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge
                            variant="secondary"
                            className="text-xs bg-primary/10 text-primary"
                          >
                            地道体验
                          </Badge>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleLike(article.articleId, e)}
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                          >
                            <Heart className="w-4 h-4" />
                            {article.likesNum || 0}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                          >
                            <MessageCircle className="w-4 h-4" />
                            {article.commentsNum || 0}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
