import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  MapPin,
  Star,
  ArrowLeft,
  Send,
  ThumbsUp,
  Reply,
  RefreshCw,
  ChevronDown,
  ChevronUp,
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
  useToggleArticleLike,
  useLikeComment,
  useUnlikeComment,
} from "../hooks/useApi";
import "../css/PostDetail.css";

// DEMO DATA
const postsData = [
  {
    article_id: 1,
    creator_id: 101,
    title: "广州老城区的咖啡文化探索",
    address: "广州市荔湾区恩宁路",
    content:
      "带你走进广州老城区的咖啡文化世界，探索那些隐藏在小巷中的独特咖啡店，了解每一杯咖啡背后的历史故事。从传统的茶文化到现代咖啡文化的融合，感受这座城市的文化变迁。在这次体验中，我们将参观3-4家具有代表性的咖啡店，每一家都有其独特的故事和特色。你将学习到咖啡的制作工艺，了解不同咖啡豆的特点，以及如何品鉴一杯好咖啡。同时，我们还会深入了解广州的历史文化，感受这座千年古城的魅力。",
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
      rating: 4.9,
      bio: "资深咖啡文化爱好者，在广州生活15年，对本地咖啡文化有深入研究。",
    },
    category: "咖啡文化",
    tags: ["咖啡", "历史", "本地文化", "老城区", "地道", "本地化"],
    duration: "3小时",
    maxGuests: 6,
    images: [
      "/guangzhou-coffee-culture.jpg",
      "/guangzhou-coffee-shop-1.jpg",
      "/guangzhou-coffee-shop-2.jpg",
      "/guangzhou-coffee-making.jpg",
    ],
  },
  {
    article_id: 2,
    creator_id: 102,
    title: "上海弄堂里的传统手工艺",
    address: "上海市黄浦区田子坊",
    content:
      "在上海的老弄堂中，依然保留着许多传统手工艺。跟随我一起探访这些匠人，学习传统技艺，感受老上海的文化底蕴。通过亲手制作，你将深刻体会到传统手工艺的魅力，感受匠人精神的可贵。这不仅是一次技艺的学习，更是一次心灵的洗礼。",
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
      rating: 4.7,
      bio: "传统手工艺传承人，专注于保护和传播上海本地文化。",
    },
    category: "传统手工",
    tags: ["手工艺", "传统文化", "弄堂", "匠人", "地道", "本地化"],
    duration: "2.5小时",
    maxGuests: 8,
    images: [
      "/shanghai-traditional-crafts.jpg",
      "/shanghai-crafts-workshop.jpg",
      "/shanghai-artisan.jpg",
    ],
  },
  {
    article_id: 3,
    creator_id: 103,
    title: "北京胡同里的美食寻味之旅",
    address: "北京市东城区南锣鼓巷",
    content:
      "走进北京的胡同深处，寻找那些只有老北京人才知道的美食秘密。从传统小吃到创新料理，每一口都是历史的味道。我们的美食之旅将从早餐开始，品尝正宗的豆浆油条、煎饼果子，然后走访几家有着数十年历史的老字号餐厅。除了品尝美食，我们还会了解每道菜背后的历史故事。",
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
      rating: 4.5,
      bio: "土生土长的老北京人，对胡同美食有着深厚的了解和热爱。",
    },
    category: "美食文化",
    tags: ["美食", "胡同", "传统小吃", "北京", "地道", "本地化"],
    duration: "4小时",
    maxGuests: 4,
    images: [
      "/beijing-hutong-food.jpg",
      "/beijing-street-food.jpg",
      "/beijing-traditional-restaurant.jpg",
    ],
  },
  {
    article_id: 4,
    creator_id: 104,
    title: "成都茶馆文化深度体验",
    address: "成都市青羊区宽窄巷子",
    content:
      "在成都的传统茶馆中，感受慢生活的节奏。学习茶艺，听老茶客讲述成都的变迁，体验最地道的成都文化。在这次体验中，我们将深入几家老茶馆，学习传统的茶艺表演，了解不同茶叶的特点和冲泡方法。茶馆不仅是品茶的地方，更是成都人社交和休闲的重要场所。",
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
      rating: 4.8,
      bio: "成都茶文化研究者，致力于传播巴蜀茶文化的精髓。",
    },
    category: "茶文化",
    tags: ["茶文化", "慢生活", "传统", "成都", "地道", "本地化"],
    duration: "2小时",
    maxGuests: 6,
    images: [
      "/chengdu-teahouse-culture.jpg",
      "/chengdu-tea-ceremony.jpg",
      "/chengdu-traditional-teahouse.jpg",
    ],
  },
  {
    article_id: 5,
    creator_id: 105,
    title: "西安古城墙下的历史漫步",
    address: "西安市碑林区南门",
    content:
      "沿着西安古城墙，聆听千年古都的历史回响。从唐朝的繁华到现代的变迁，每一块砖石都诉说着不同的故事。在这次旅程中，我们会了解城墙的建造历史、防御功能，以及不同历史时期的修缮过程。从城墙上俯瞰现代西安，古今对比令人感慨。这不仅是一次历史的学习，更是一次时空的穿越体验。",
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
      rating: 4.9,
      bio: "西安历史文化专家，专业导游15年，对古都历史有着深入的研究。",
    },
    category: "历史文化",
    tags: ["历史", "古城墙", "唐朝", "西安", "地道", "本地化"],
    duration: "3.5小时",
    maxGuests: 10,
    images: [
      "/xian-ancient-wall.jpg",
      "/xian-city-view.jpg",
      "/xian-historical-sites.jpg",
    ],
  },
];

// Mock user data for display
const mockUsers = {
  101: {
    name: "张小明",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    location: "广州",
  },
  102: {
    name: "Ale Chen",
    avatar:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uilN86FuKAmS6s2N3SbfVfcxjEYkui.png",
    location: "广州",
    isAuthor: true,
  },
  103: {
    name: "小咖啡",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b-1a3e?w=150&h=150&fit=crop&crop=face",
    location: "深圳",
  },
  104: {
    name: "李文静",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    location: "深圳",
  },
  105: {
    name: "旅行者",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    location: "北京",
  },
  106: {
    name: "王大力",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    location: "广州",
  },
  107: {
    name: "陈小花",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    location: "广州",
  },
  108: {
    name: "文化探索者",
    avatar:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
    location: "上海",
  },
  109: {
    name: "茶文化爱好者",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    location: "杭州",
  },
};

// Helper function to get user info
const getUserInfo = (userId) => {
  return (
    mockUsers[userId] || {
      name: `User #${userId}`,
      avatar: "/placeholder.svg",
      location: "未知",
    }
  );
};

// Mock comments data matching backend ArticleCommentsResponse structure
const mockCommentsResponse = {
  articleId: 1,
  commentCount: 3,
  comments: [
    {
      comment: {
        commentId: 1,
        commentatorId: 101,
        articleId: 1,
        content:
          "太棒了！上周参加了这个体验，Ale老师讲解得非常详细，那几家咖啡店真的很有特色，特别是那家藏在巷子里的老店，咖啡香味至今还记得。强烈推荐给喜欢咖啡文化的朋友！",
        createTime: "2024-12-20T09:00:00.000+00:00",
      },
      replies: [
        {
          replyId: 11,
          commentId: 1,
          replierId: 102,
          content:
            "谢谢你的支持！很高兴你喜欢这次体验，那家老店确实是我的最爱之一。",
          createTime: "2024-12-20T09:30:00.000+00:00",
        },
        {
          replyId: 12,
          commentId: 1,
          replierId: 103,
          content: "我也想去试试！请问那家老店叫什么名字？",
          createTime: "2024-12-20T10:00:00.000+00:00",
        },
        {
          replyId: 13,
          commentId: 1,
          replierId: 102,
          content:
            "@小咖啡 那家店叫'时光咖啡馆'，在恩宁路的一条小巷里，很容易错过。老板是个很有故事的人，做咖啡已经30多年了。",
          createTime: "2024-12-20T10:15:00.000+00:00",
        },
      ],
      replyCount: 3,
      likeCount: 12,
    },
    {
      comment: {
        commentId: 2,
        commentatorId: 104,
        articleId: 1,
        content:
          "作为一个咖啡爱好者，这个体验让我对广州的咖啡文化有了全新的认识。不仅学到了很多咖啡知识，还了解了广州的历史文化。Ale老师人很好，讲解生动有趣。下次来广州还想参加！",
        createTime: "2024-12-20T07:00:00.000+00:00",
      },
      replies: [
        {
          replyId: 21,
          commentId: 2,
          replierId: 105,
          content:
            "同感！我也是从外地来的，这种深度体验真的比走马观花的旅游有意思多了。",
          createTime: "2024-12-20T08:00:00.000+00:00",
        },
        {
          replyId: 22,
          commentId: 2,
          replierId: 106,
          content:
            "哈哈，看到外地朋友这么认可我们广州的文化，我这个本地人都感到骄傲呢！",
          createTime: "2024-12-20T08:30:00.000+00:00",
        },
      ],
      replyCount: 2,
      likeCount: 8,
    },
    {
      comment: {
        commentId: 3,
        commentatorId: 106,
        articleId: 1,
        content:
          "本地人表示学到了很多！原来我们身边有这么多有故事的咖啡店，以前都没注意到。这种深度体验真的很有意义，让我重新认识了自己的城市。期待有更多这样的本地文化体验！",
        createTime: "2024-12-20T06:00:00.000+00:00",
      },
      replies: [
        {
          replyId: 31,
          commentId: 3,
          replierId: 107,
          content: "同感！有时候外地人比我们本地人更了解我们的城市文化呢。",
          createTime: "2024-12-20T06:30:00.000+00:00",
        },
        {
          replyId: 32,
          commentId: 3,
          replierId: 108,
          content: "广州真的有太多隐藏的文化宝藏了，需要有心人去发现和分享。",
          createTime: "2024-12-20T07:15:00.000+00:00",
        },
        {
          replyId: 33,
          commentId: 3,
          replierId: 109,
          content:
            "希望能有更多关于广州传统茶文化的体验，毕竟咖啡文化也是在茶文化基础上发展的。",
          createTime: "2024-12-20T07:45:00.000+00:00",
        },
        {
          replyId: 34,
          commentId: 3,
          replierId: 102,
          content:
            "@茶文化爱好者 好建议！我正在策划一个茶文化与咖啡文化融合的体验活动，敬请期待！",
          createTime: "2024-12-20T08:00:00.000+00:00",
        },
      ],
      replyCount: 4,
      likeCount: 15,
    },
  ],
};

/**
 * PostDetail component displays the details of a single post, including its content, author information, tags, and interactive actions such as liking and commenting.
 *
 * Features:
 * - Fetches and displays post data based on the route parameter `id`.
 * - Shows post image, title, content, author details, and tags.
 * - Allows users to like the post and view the number of likes and comments.
 * - Renders a comments section with loading and error states.
 * - Enables users to add new comments and replies to existing comments.
 * - Supports liking individual comments.
 * - Handles UI interactions such as expanding/collapsing the comments section.
 *
 * @component
 * @returns {JSX.Element} The rendered post detail page with interactive comments.
 */
export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [expandedComments, setExpandedComments] = useState(true);

  const postData = postsData.find((p) => p.article_id === parseInt(id));

  // TanStack Query hooks
  const {
    data: comments = mockCommentsResponse, // Fallback to mock data
    isLoading: commentsLoading,
    isError: commentsError,
    refetch: refetchComments,
  } = useComments(parseInt(id));

  const createCommentMutation = useCreateComment();
  const createReplyMutation = useCreateReply();
  const toggleArticleLikeMutation = useToggleArticleLike();
  const likeCommentMutation = useLikeComment();
  const unlikeCommentMutation = useUnlikeComment();

  useEffect(() => {
    if (postData) {
      setPost({
        ...postData,
        stats: {
          likes: postData.likes_num,
          comments: postData.comments_num,
          bookmarks: 67,
          views: 1240,
        },
        publishedAt: "2小时前",
        isLiked: false,
        isBookmarked: false,
      });
    }
  }, [postData]);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            文章未找到
          </h1>
          <Link to="/">
            <Button variant="outline">返回首页</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    toggleArticleLikeMutation.mutate({
      articleId: parseInt(id),
      // TODO: replace with actual user ID
      likeData: { userId: 1 },
    });

    setPost({
      ...post,
      isLiked: !post.isLiked,
      stats: {
        ...post.stats,
        likes: post.isLiked ? post.stats.likes - 1 : post.stats.likes + 1,
      },
    });
  };

  const handleCommentLike = (commentId, isCurrentlyLiked) => {
    if (isCurrentlyLiked) {
      unlikeCommentMutation.mutate(commentId);
    } else {
      likeCommentMutation.mutate(commentId);
    }
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      createCommentMutation.mutate({
        articleId: parseInt(id),
        content: newComment,
        // TODO: replace with actual user ID
        userId: 1,
      });
      setNewComment("");

      setPost({
        ...post,
        stats: {
          ...post.stats,
          comments: post.stats.comments + 1,
        },
      });
    }
  };

  const handleSubmitReply = (commentId) => {
    if (replyContent.trim()) {
      createReplyMutation.mutate({
        commentId,
        content: replyContent,
        // TODO: replace with actual user ID
        userId: 1,
      });
      setReplyContent("");
      setReplyTo(null);
    }
  };

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
                  post.image ||
                  `/placeholder.svg?height=400&width=800&query=${encodeURIComponent(post.title)}`
                }
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
                  {post.category}
                </Badge>
              </div>
            </div>

            <div className="p-6">
              {/* Author Info */}
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={post.author.avatar || "/placeholder.svg"}
                    alt={post.author.name}
                  />
                  <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-card-foreground">
                      {post.author.name}
                    </h4>
                    {post.author.isVerified && (
                      <Badge variant="secondary" className="text-xs">
                        认证达人
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {post.author.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {post.author.rating}
                    </div>
                    <span>{post.publishedAt}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {post.author.bio}
                  </p>
                </div>
              </div>

              {/* Post Title and Content */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-card-foreground mb-4 text-balance">
                  {post.title}
                </h1>
                <p className="text-muted-foreground leading-relaxed text-pretty">
                  {post.content}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs border-border mypost-border tag-blue hover:bg-accent cursor-pointer"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <Heart
                      className={`w-4 h-4 ${post.isLiked ? "fill-red-500 text-red-500" : ""}`}
                    />
                    {post.stats.likes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setExpandedComments(true)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    {post.stats.comments}
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
                评论 ({post.stats.comments})
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
                          disabled={!newComment.trim()}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          发表评论
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
                          <div className="flex gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage
                                src={
                                  getUserInfo(
                                    commentWithReplies.comment.commentatorId
                                  ).avatar
                                }
                                alt={
                                  getUserInfo(
                                    commentWithReplies.comment.commentatorId
                                  ).name
                                }
                              />
                              <AvatarFallback>
                                {getUserInfo(
                                  commentWithReplies.comment.commentatorId
                                ).name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-card-foreground">
                                  {
                                    getUserInfo(
                                      commentWithReplies.comment.commentatorId
                                    ).name
                                  }
                                </span>
                                {getUserInfo(
                                  commentWithReplies.comment.commentatorId
                                ).isAuthor && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    作者
                                  </Badge>
                                )}
                                <span className="text-xs text-muted-foreground">
                                  {
                                    getUserInfo(
                                      commentWithReplies.comment.commentatorId
                                    ).location
                                  }
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
                                      commentWithReplies.comment.commentId,
                                      false
                                    )
                                  }
                                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground p-0 h-auto"
                                >
                                  <ThumbsUp className="w-3 h-3" />
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
                                        : commentWithReplies.comment.commentId
                                    )
                                  }
                                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground p-0 h-auto"
                                >
                                  <Reply className="w-3 h-3" />
                                  回复
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
                                      placeholder={`回复 ${getUserInfo(commentWithReplies.comment.commentatorId).name}...`}
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
                                            commentWithReplies.comment.commentId
                                          )
                                        }
                                        disabled={!replyContent.trim()}
                                      >
                                        回复
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Replies */}
                              {commentWithReplies.replies &&
                                commentWithReplies.replies.length > 0 && (
                                  <div className="mt-4 space-y-3">
                                    {commentWithReplies.replies.map((reply) => (
                                      <div
                                        key={reply.replyId}
                                        className="flex gap-2 ml-4 border-l-2 border-border pl-3"
                                      >
                                        <Avatar className="w-6 h-6">
                                          <AvatarImage
                                            src={
                                              getUserInfo(reply.replierId)
                                                .avatar
                                            }
                                            alt={
                                              getUserInfo(reply.replierId).name
                                            }
                                          />
                                          <AvatarFallback>
                                            {getUserInfo(
                                              reply.replierId
                                            ).name.charAt(0)}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-card-foreground text-sm">
                                              {
                                                getUserInfo(reply.replierId)
                                                  .name
                                              }
                                            </span>
                                            {getUserInfo(reply.replierId)
                                              .isAuthor && (
                                              <Badge
                                                variant="secondary"
                                                className="text-xs"
                                              >
                                                作者
                                              </Badge>
                                            )}
                                            <span className="text-xs text-muted-foreground">
                                              {
                                                getUserInfo(reply.replierId)
                                                  .location
                                              }
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                              ·{" "}
                                              {new Date(
                                                reply.createTime
                                              ).toLocaleString("zh-CN")}
                                            </span>
                                          </div>
                                          <p className="text-muted-foreground text-sm leading-relaxed">
                                            {reply.content}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                            </div>
                          </div>
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
