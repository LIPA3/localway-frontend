import { useState } from "react";
import { Heart, MessageCircle, MapPin, Search, TrendingUp } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";

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
  const sortedPosts = [...recommendedPosts].sort((a, b) => {
    if (a.author.isVerified !== b.author.isVerified) {
      return b.author.isVerified - a.author.isVerified;
    }
    return b.likes_num - a.likes_num;
  });

  const [posts, setPosts] = useState(sortedPosts);

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.article_id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes_num: post.isLiked ? post.likes_num - 1 : post.likes_num + 1,
            }
          : post
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
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
          {posts.map((post) => (
            <Card
              key={post.article_id}
              className="border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-0">
                <div className="md:flex">
                  {/* Image */}
                  <div className="md:w-80 h-64 md:h-auto relative">
                    <img
                      src={
                        post.image || "/placeholder.svg?height=300&width=400"
                      }
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-primary/90 text-primary-foreground">
                        {post.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    {/* Author Info */}
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage
                          src={post.author.avatar || "/placeholder.svg"}
                          alt={post.author.name}
                        />
                        <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-card-foreground">
                            {post.author.name}
                          </h4>
                          {post.author.isVerified && (
                            <Badge variant="secondary" className="text-xs">
                              认证
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {post.author.location}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(post.create_time).toLocaleDateString("zh-CN")}
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="mb-4">
                      <h2 className="text-xl font-bold text-card-foreground mb-2 text-balance">
                        {post.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed line-clamp-3 text-pretty">
                        {post.content}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs border-border"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Experience Details */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {post.address}
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
                          onClick={() => handleLike(post.article_id)}
                          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        >
                          <Heart
                            className={`w-4 h-4 ${post.isLiked ? "fill-red-500 text-red-500" : ""}`}
                          />
                          {post.likes_num}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                        >
                          <MessageCircle className="w-4 h-4" />
                          {post.comments_num}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
