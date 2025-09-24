import { Link, useLocation, useParams } from "react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Heart,
  MapPin,
  MessageCircle,
  RefreshCw,
  Reply,
  Send,
  ThumbsUp,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar";
import { Textarea } from "../components/ui/Textarea";
import {
  useComments,
  useCreateComment,
  useCreateReply,
  useLikeComment,
  useToggleArticleLike,
  useUnlikeComment,
  useUserInfo,
  useUserLikedArticles,
  useUserLikedComments,
} from "../hooks/useApi";
import "../css/PostDetail.css";

// Component to fetch user info for comments and replies
function UserInfoProvider({ userId, children }) {
  const { data: userInfo, isLoading } = useUserInfo(userId);

  return children({
    userInfo,
    isLoading,
    name: userInfo?.userName || `User #${userId}`,
    // avatar: userInfo?.avatar || "/placeholder.svg",
    avatar: userInfo?.avatar ?? "https://picsum.photos/128",
    role: userInfo?.role,
  });
}

export default function PostDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [expandedComments, setExpandedComments] = useState(true);
  const [likedArticles, setLikedArticles] = useState(new Set());
  const [likedComments, setLikedComments] = useState(new Set());
  const [likeCount, setLikeCount] = useState(0);

  const article = location.state?.article;

  useEffect(() => {
    setLikeCount(article?.likesNum || 0);
  }, [article]);

  // TODO: Replace with actual userId from auth context/session
  const currentUserId = 1;

  const { data: userLikedList } = useUserLikedArticles(currentUserId);

  const { data: userLikedComments } = useUserLikedComments(currentUserId);

  const { data: creatorInfo } = useUserInfo(article?.creatorId);

  // Fetch comments
  const {
    data: comments,
    isLoading: commentsLoading,
    isError: commentsError,
    refetch: refetchComments,
  } = useComments(parseInt(id));

  useEffect(() => {
    if (
      userLikedList &&
      userLikedList.articleIds &&
      Array.isArray(userLikedList.articleIds)
    ) {
      setLikedArticles(new Set(userLikedList.articleIds));
    }
  }, [userLikedList]);

  useEffect(() => {
    if (userLikedComments && Array.isArray(userLikedComments.commentIds)) {
      setLikedComments(new Set(userLikedComments.commentIds));
    }
  }, [userLikedComments]);

  // Mutations
  const createCommentMutation = useCreateComment();
  const createReplyMutation = useCreateReply();
  const toggleArticleLikeMutation = useToggleArticleLike();
  const likeCommentMutation = useLikeComment();
  const unlikeCommentMutation = useUnlikeComment();

  // Show not found state if no article data
  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            文章未找到
          </h1>
          <p className="text-muted-foreground mb-4">
            请从文章列表页面访问此页面
          </p>
          <Link to="/">
            <Button variant="outline">返回首页</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    const isCurrentlyLiked = likedArticles.has(parseInt(id));

    setLikeCount((prev) => (isCurrentlyLiked ? prev - 1 : prev + 1));

    // Optimistic update
    setLikedArticles((prev) => {
      const newSet = new Set(prev);
      if (isCurrentlyLiked) {
        newSet.delete(parseInt(id));
      } else {
        newSet.add(parseInt(id));
      }
      return newSet;
    });

    toggleArticleLikeMutation.mutate(
      {
        articleId: parseInt(id),
        likeData: { userId: currentUserId },
      },
      {
        onError: () => {
          // Revert on error
          setLikedArticles((prev) => {
            const newSet = new Set(prev);
            if (isCurrentlyLiked) {
              newSet.add(parseInt(id));
            } else {
              newSet.delete(parseInt(id));
            }
            return newSet;
          });
          setLikeCount((prev) => (isCurrentlyLiked ? prev + 1 : prev - 1));
        },
      }
    );
  };

  const handleCommentLike = (commentId) => {
    const isCurrentlyLiked = likedComments.has(commentId);

    // Optimistic update
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (isCurrentlyLiked) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });

    if (isCurrentlyLiked) {
      unlikeCommentMutation.mutate(
        {
          commentId,
          commentLikeRequest: { userId: currentUserId },
        },
        {
          onError: () => {
            setLikedComments((prev) => new Set(prev).add(commentId));
          },
        }
      );
    } else {
      likeCommentMutation.mutate(
        {
          commentId,
          commentLikeRequest: { userId: currentUserId },
        },
        {
          onError: () => {
            setLikedComments((prev) => {
              const newSet = new Set(prev);
              newSet.delete(commentId);
              return newSet;
            });
          },
        }
      );
    }
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      createCommentMutation.mutate({
        commentatorId: currentUserId,
        articleId: parseInt(id),
        content: newComment,
      });
      setNewComment("");
    }
  };

  const handleSubmitReply = (commentId) => {
    if (replyContent.trim()) {
      createReplyMutation.mutate({
        replierId: currentUserId,
        commentId,
        content: replyContent,
      });
      setReplyContent("");
      setReplyTo(null);
    }
  };

  const isLiked = likedArticles.has(parseInt(id));

  return (
    <div className="post-detail min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回列表
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-foreground">体验详情</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Post Content */}
        <Card className="post-card border border-border bg-card mb-6">
          <CardContent className="p-0">
            {/* Hero Image */}
            <div className="relative h-80 overflow-hidden">
              <img
                src={
                  article.image ||
                  // `/placeholder.svg?height=400&width=800&query=${encodeURIComponent(article.title)}`
                  "https://picsum.photos/800/400"
                }
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
                  {article.tagList?.[0]?.tagName || "体验"}
                </Badge>
              </div>
            </div>

            <div className="p-6">
              {/* Author Info */}
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    // src={creatorInfo?.avatar || "/placeholder.svg"}
                    src={creatorInfo?.avatar || "https://picsum.photos/128"}
                    alt={creatorInfo?.userName || "作者"}
                  />
                  <AvatarFallback>
                    {creatorInfo?.userName?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-card-foreground">
                      {creatorInfo?.userName || `创作者 #${article.creatorId}`}
                    </h4>
                    {creatorInfo?.role === "CREATOR" && (
                      <Badge variant="secondary" className="text-xs">
                        认证达人
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {article.address || "位置未知"}
                    </div>
                  </div>
                  {creatorInfo?.motto && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {creatorInfo.motto}
                    </p>
                  )}
                </div>
              </div>

              {/* Post Title and Content */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-card-foreground mb-4 text-balance">
                  {article.title}
                </h1>
                <p className="text-muted-foreground leading-relaxed text-pretty">
                  {article.content}
                </p>
              </div>

              {/* Tags */}
              {article.tagList && article.tagList.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {article.tagList.map((tag) => (
                    <Badge
                      key={tag.tagId}
                      variant="outline"
                      className="text-xs border-border mypost-border tag-blue hover:bg-accent cursor-pointer"
                    >
                      #{tag.tagName}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    disabled={toggleArticleLikeMutation.isPending}
                  >
                    <Heart
                      className={`w-4 h-4 transition-all ${
                        isLiked
                          ? "fill-red-500 text-red-500"
                          : "text-muted-foreground hover:text-red-500"
                      }`}
                    />
                    {likeCount}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setExpandedComments(true)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    {comments?.commentCount || article.commentsNum || 0}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="post-card border border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-card-foreground">
                评论 ({comments?.commentCount || 0})
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedComments(!expandedComments)}
                className="flex items-center gap-2"
              >
                {expandedComments ? (
                  <>
                    <ChevronUp className="w-4 h-4" />
                    收起
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    展开评论
                  </>
                )}
              </Button>
            </div>

            {expandedComments && (
              <>
                {/* Add Comment */}
                <div className="mb-6">
                  <div className="flex gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src="/current-user-avatar.jpg"
                        alt="当前用户"
                      />
                      <AvatarFallback>我</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        placeholder="分享你的想法..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[80px] resize-none border-border"
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          size="sm"
                          onClick={handleSubmitComment}
                          disabled={
                            !newComment.trim() ||
                            createCommentMutation.isPending
                          }
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {createCommentMutation.isPending
                            ? "发表中..."
                            : "发表评论"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comments Loading State */}
                {commentsLoading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      正在加载评论...
                    </div>
                  </div>
                )}

                {/* Comments Error State */}
                {commentsError && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <p className="text-muted-foreground mb-4">评论加载失败</p>
                    <Button
                      variant="outline"
                      onClick={() => refetchComments()}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      重新加载
                    </Button>
                  </div>
                )}

                {/* Empty Comments State */}
                {!commentsLoading &&
                  !commentsError &&
                  (!comments?.comments || comments.comments.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <MessageCircle className="w-12 h-12 text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground mb-2">暂无评论</p>
                      <p className="text-sm text-muted-foreground">
                        成为第一个评论的人吧！
                      </p>
                    </div>
                  )}

                {/* Comments List */}
                {!commentsLoading &&
                  !commentsError &&
                  comments?.comments &&
                  comments.comments.length > 0 && (
                    <div className="space-y-6">
                      {comments.comments.map((commentWithReplies) => (
                        <div
                          key={commentWithReplies.comment.commentId}
                          className="border-b border-border last:border-b-0 pb-6 last:pb-0"
                        >
                          <UserInfoProvider
                            userId={commentWithReplies.comment.commentatorId}
                          >
                            {({ name, avatar, location, role, isLoading }) => (
                              <div className="flex gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={avatar} alt={name} />
                                  <AvatarFallback>
                                    {isLoading ? "?" : name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-card-foreground">
                                      {isLoading ? "加载中..." : name}
                                    </span>
                                    {role === "CREATOR" && (
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        创作者
                                      </Badge>
                                    )}
                                    <span className="text-xs text-muted-foreground">
                                      {location}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      ·{" "}
                                      {new Date(
                                        commentWithReplies.comment.createTime
                                      ).toLocaleString("zh-CN")}
                                    </span>
                                  </div>
                                  <p className="text-muted-foreground mb-3 leading-relaxed">
                                    {commentWithReplies.comment.content}
                                  </p>
                                  <div className="flex items-center gap-4">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleCommentLike(
                                          commentWithReplies.comment.commentId
                                        )
                                      }
                                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground p-0 h-auto"
                                    >
                                      <ThumbsUp
                                        className={`w-3 h-3 transition-all ${
                                          likedComments.has(
                                            commentWithReplies.comment.commentId
                                          )
                                            ? "fill-blue-500 text-blue-500"
                                            : "text-muted-foreground hover:text-blue-500"
                                        }`}
                                      />
                                      {commentWithReplies.likeCount || 0}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        setReplyTo(
                                          replyTo ===
                                            commentWithReplies.comment.commentId
                                            ? null
                                            : commentWithReplies.comment
                                                .commentId
                                        )
                                      }
                                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground p-0 h-auto"
                                    >
                                      <Reply className="w-3 h-3" />
                                      回复 ({commentWithReplies.replyCount || 0}
                                      )
                                    </Button>
                                  </div>

                                  {/* Reply Form */}
                                  {replyTo ===
                                    commentWithReplies.comment.commentId && (
                                    <div className="mt-3 flex gap-2">
                                      <Avatar className="w-6 h-6">
                                        <AvatarImage
                                          src="/current-user-avatar.jpg"
                                          alt="当前用户"
                                        />
                                        <AvatarFallback>我</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <Textarea
                                          placeholder={`回复 ${name}...`}
                                          value={replyContent}
                                          onChange={(e) =>
                                            setReplyContent(e.target.value)
                                          }
                                          className="min-h-[60px] resize-none border-border text-sm"
                                        />
                                        <div className="flex justify-end gap-2 mt-2">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                              setReplyTo(null);
                                              setReplyContent("");
                                            }}
                                          >
                                            取消
                                          </Button>
                                          <Button
                                            size="sm"
                                            onClick={() =>
                                              handleSubmitReply(
                                                commentWithReplies.comment
                                                  .commentId
                                              )
                                            }
                                            disabled={
                                              !replyContent.trim() ||
                                              createReplyMutation.isPending
                                            }
                                          >
                                            {createReplyMutation.isPending
                                              ? "回复中..."
                                              : "回复"}
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Replies */}
                                  {commentWithReplies.replies &&
                                    commentWithReplies.replies.length > 0 && (
                                      <div className="mt-4 space-y-3">
                                        {commentWithReplies.replies.map(
                                          (reply) => (
                                            <UserInfoProvider
                                              key={reply.replyId}
                                              userId={reply.replierId}
                                            >
                                              {({
                                                name: replyName,
                                                avatar: replyAvatar,
                                                location: replyLocation,
                                                role: replyRole,
                                                isLoading: replyLoading,
                                              }) => (
                                                <div className="flex gap-2 ml-4 border-l-2 border-border pl-3">
                                                  <Avatar className="w-6 h-6">
                                                    <AvatarImage
                                                      src={replyAvatar}
                                                      alt={replyName}
                                                    />
                                                    <AvatarFallback>
                                                      {replyLoading
                                                        ? "?"
                                                        : replyName.charAt(0)}
                                                    </AvatarFallback>
                                                  </Avatar>
                                                  <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                      <span className="font-medium text-card-foreground text-sm">
                                                        {replyLoading
                                                          ? "加载中..."
                                                          : replyName}
                                                      </span>
                                                      {replyRole ===
                                                        "CREATOR" && (
                                                        <Badge
                                                          variant="secondary"
                                                          className="text-xs"
                                                        >
                                                          创作者
                                                        </Badge>
                                                      )}
                                                      <span className="text-xs text-muted-foreground">
                                                        {replyLocation}
                                                      </span>
                                                      <span className="text-xs text-muted-foreground">
                                                        ·{" "}
                                                        {new Date(
                                                          reply.createTime
                                                        ).toLocaleString(
                                                          "zh-CN"
                                                        )}
                                                      </span>
                                                    </div>
                                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                                      {reply.content}
                                                    </p>
                                                  </div>
                                                </div>
                                              )}
                                            </UserInfoProvider>
                                          )
                                        )}
                                      </div>
                                    )}
                                </div>
                              </div>
                            )}
                          </UserInfoProvider>
                        </div>
                      ))}
                    </div>
                  )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
