import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  MessageCircle,
  RefreshCw,
  Search,
  TrendingUp,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import {
  useArticles,
  useToggleArticleLike,
  useUserInfo,
  useUserLikedArticles,
} from "../../hooks/useApi";

// Component to display user info with real data
function UserAvatar({ userId, className = "" }) {
  const { data: userInfo, isLoading } = useUserInfo(userId);

  if (isLoading || !userInfo) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Avatar className="w-10 h-10">
          <AvatarFallback>{userId ? `U${userId}` : "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-card-foreground">
              {isLoading ? "加载中..." : `创作者 #${userId || "Unknown"}`}
            </h4>
            <Badge variant="secondary" className="text-xs">
              认证
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Avatar className="w-10 h-10">
        <AvatarImage src="/placeholder.svg" alt={userInfo.userName} />
        <AvatarFallback>
          {userInfo.userName
            ? userInfo.userName.charAt(0).toUpperCase()
            : `U${userId}`}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-card-foreground">
            {userInfo.userName || `创作者 #${userId}`}
          </h4>
          <Badge variant="secondary" className="text-xs">
            {userInfo.role === "ADMIN"
              ? "管理员"
              : userInfo.role === "CREATOR"
                ? "创作者"
                : "认证"}
          </Badge>
        </div>
        {userInfo.motto && (
          <p className="text-sm text-muted-foreground">{userInfo.motto}</p>
        )}
      </div>
    </div>
  );
}

export function RecommendedPostsPage({ pageSizeOptions = [3, 6, 9, 12, 15] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(pageSizeOptions[1] || 6);
  const [likedArticles, setLikedArticles] = useState(new Set());

  // TODO: Replace with actual userId from auth context/session
  const userId = 1;
  const { data: userLikedList, isLoading: isUserLikeLoading } =
    useUserLikedArticles(userId);

  console.log("User liked articles:", userLikedList);

  useEffect(() => {
    if (
      userLikedList &&
      userLikedList.articleIds &&
      Array.isArray(userLikedList.articleIds)
    ) {
      setLikedArticles(new Set(userLikedList.articleIds));
    }
  }, [userLikedList]);

  const {
    data: articles = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useArticles(page, size, debouncedSearchQuery || undefined);

  const toggleArticleLikeMutation = useToggleArticleLike();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLike = (articleId, event) => {
    event.preventDefault();
    event.stopPropagation();
    const isCurrentlyLiked = likedArticles.has(articleId);

    setLikedArticles((prev) => {
      const newSet = new Set(prev);
      if (isCurrentlyLiked) {
        newSet.delete(articleId);
      } else {
        newSet.add(articleId);
      }
      return newSet;
    });

    toggleArticleLikeMutation.mutate(
      {
        articleId,
        likeData: { userId },
      },
      {
        onError: () => {
          setLikedArticles((prev) => {
            const newSet = new Set(prev);
            if (isCurrentlyLiked) {
              newSet.add(articleId);
            } else {
              newSet.delete(articleId);
            }
            return newSet;
          });
        },
      }
    );
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSizeChange = (newSize) => {
    setSize(newSize);
    setPage(1);
  };

  useEffect(() => {
    if (!pageSizeOptions.includes(size)) {
      setSize(pageSizeOptions[0] || 6);
    }
  }, [pageSizeOptions, size]);

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
              <img
                src="../../../public/LocalWay_Icon.png"
                alt="LocalWay"
                className="w-8 h-8 rounded-lg"
              />
              <h1 className="text-xl font-bold text-foreground">LocalWay</h1>
            </div>
          </div>

          {/* Search Bar and Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="搜索体验或地点..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>

            {/* Page Size Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                每页显示:
              </span>
              <select
                value={size}
                onChange={(e) => handleSizeChange(Number(e.target.value))}
                className="px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {pageSizeOptions.map((optionSize) => (
                  <option key={optionSize} value={optionSize}>
                    {optionSize}篇
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Articles Status Info */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-muted-foreground">
            第 {page} 页{" "}
            {articles.length > 0 && `· 显示 ${articles.length} 篇文章`}
          </div>
          {debouncedSearchQuery && (
            <div className="text-sm text-muted-foreground">
              搜索关键词: "{debouncedSearchQuery}"
            </div>
          )}
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>暂无文章</p>
            {debouncedSearchQuery && (
              <p className="mt-2">
                没有找到包含 "{debouncedSearchQuery}" 的文章
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-6">
              {articles.map((article) => (
                <Link
                  key={article.articleId}
                  to={`/posts/${article.articleId}`}
                  state={{ article }}
                  className="block"
                >
                  <Card className="post-card border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-0">
                      <div className="md:flex">
                        {/* Image */}
                        <div className="md:w-80 h-64 md:h-auto relative">
                          <img
                            src={
                              article.image ?? "https://picsum.photos/400/300"
                              // article.image ||
                              // "/placeholder.svg?height=300&width=400"
                            }
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-primary/90 text-primary-foreground">
                              {article.tagList?.[0]?.tagName || "体验"}
                            </Badge>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-6">
                          {/* Author Info */}
                          <div className="mb-4">
                            <UserAvatar userId={article.creatorId} />
                          </div>

                          {/* Post Content */}
                          <div className="mb-4">
                            <h2 className="text-xl font-bold text-card-foreground mb-2 text-balance">
                              {article.title}
                            </h2>
                            <div className="flex items-center gap-1 mb-2">
                              <MapPin className="w-3 h-3" />
                              {article.address || "位置未知"}
                            </div>
                            <p className="text-muted-foreground leading-relaxed line-clamp-3 text-pretty">
                              {article.content}
                            </p>
                          </div>

                          {/* Tags */}
                          {article.tagList && article.tagList.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {article.tagList.map((tag, index) => (
                                <Badge
                                  key={tag.tagId || index}
                                  variant="outline"
                                  className="text-xs mypost-border tag-blue"
                                >
                                  #{tag.tagName}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) =>
                                  handleLike(article.articleId, e)
                                }
                                className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                                disabled={toggleArticleLikeMutation.isPending}
                              >
                                <Heart
                                  className={`w-4 h-4 transition-all ${
                                    likedArticles.has(article.articleId)
                                      ? "fill-red-500 text-red-500"
                                      : "text-muted-foreground hover:text-red-500"
                                  }`}
                                />
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

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                上一页
              </Button>

              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  第 {page} 页
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={articles.length < size}
                className="flex items-center gap-2"
              >
                下一页
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
