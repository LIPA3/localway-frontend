"use client"

import { useState, useEffect } from "react"
import {
  User,
  Settings,
  BarChart3,
  Heart,
  MessageCircle,
  Share2,
  Edit,
  Plus,
  MapPin,
  Calendar,
  Users,
} from "lucide-react"
import { Button } from "../ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs"
import { Link } from "react-router"
import "../../css/CreatorPage.css"
import { apiClient } from "../../api/Api"
const api = apiClient


export function CreatorProfilePage() {
  const [activeTab, setActiveTab] = useState("posts")
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalLikes, setTotalLikes] = useState(0)

  const creatorStats = {
    totalPosts: articles.length || 24,
    totalFollowers: 890,
    totalExperiences: 18,
  }

  const getCreatorInfo = async () => {
    try {
      setLoading(true)

      const response = await api.get('articles/1');

      console.log('API响应:', response);
      console.log('响应数据:', response.data);

      if (response.data) {
        // 根据实际后端返回的数据结构调整
        const data = response.data;

        // 如果是直接返回数组
        if (Array.isArray(data)) {
          setArticles(data);
          setPagination(prev => ({
            ...prev,
            total: data.length
          }));
        }
        // 如果是分页对象结构
        else if (data.records || data.content || data.data) {
          const records = data.records || data.content || data.data || [];
          setArticles(records);
          setPagination({
            page: data.current || data.number || page,
            size: data.size || size,
            total: data.total || data.totalElements || records.length,
            totalPages: data.pages || data.totalPages || Math.ceil((data.total || records.length) / size)
          });
        }
        // 如果直接是数据对象
        else {
          setArticles([data]);
        }

        console.log('设置的文章数据:', articles);
      }
    } catch (error) {
      console.error('获取创作者信息失败:', error);
      console.error('错误详情:', error.response?.data);
    } finally {
      setLoading(false)
    }
  }

  //获得点赞数
  const getLikesCount = async () => {
    try {
      const response = await api.get('users/likes/1');
      setTotalLikes(response.data);
      console.log('点赞数:', response.data);
    } catch (error) {
      console.error('获取点赞数失败:', error);
    }
  }

  // 页面加载时获取数据
  useEffect(() => {
    console.log('组件挂载，开始获取数据');
    getCreatorInfo();
    getLikesCount();
  }, [])

  return (
    <div className="creator-page min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">创作者中心</h1>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/creator-edit">
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  编辑内容
                </Button>
              </Link>
              <Link to="/createArticle">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  创建新体验
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Profile Section */}
          <Card className="post-card mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center md:items-start">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarImage src="/creator-profile-avatar.jpg" />
                    <AvatarFallback>AC</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    编辑资料
                  </Button>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold">Ale Chen</h2>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800 mypost-border">
                      认证
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>广州</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>加入于 2023年</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">
                    专注于分享广州本地文化体验，带你探索最地道的咖啡文化、传统手工艺和街头美食。
                    让每一次体验都成为难忘的文化之旅。
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{creatorStats.totalPosts}</div>
                      <div className="text-sm text-muted-foreground">发布内容</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{totalLikes}</div>
                      <div className="text-sm text-muted-foreground">获得点赞</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{creatorStats.totalFollowers}</div>
                      <div className="text-sm text-muted-foreground">关注者</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{creatorStats.totalExperiences}</div>
                      <div className="text-sm text-muted-foreground">体验次数</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="tabs-list grid w-full grid-cols-3">
              <TabsTrigger value="posts">我的内容</TabsTrigger>
              <TabsTrigger value="analytics">数据分析</TabsTrigger>
              <TabsTrigger value="settings">设置</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">我的发布内容</h3>
                <Link to="/createArticle">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    创建新内容
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">加载中...</p>
                  </div>
                ) : articles.length > 0 ? (
                  articles.map((post) => (
                    <Card key={post.id} className="post-card overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={post.image || post.coverImage || "/placeholder.svg"}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold line-clamp-2 flex-1">{post.title}</h4>
                          {post.status && (
                            <Badge 
                              variant="outline" 
                              className={`ml-2 text-xs ${
                                post.status === 'pending' 
                                  ? 'bg-yellow-50 text-yellow-700 border-yellow-200' 
                                  : post.status === 'approved' 
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : 'bg-red-50 text-red-700 border-red-200'
                              }`}
                            >
                              {post.status === 'pending' 
                                ? '审核中' 
                                : post.status === 'approved' 
                                  ? '审核通过' 
                                  : '审核不通过'
                              }
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                          <MapPin className="w-3 h-3" />
                          <span>{post.address || "未知地点"}</span>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {(post.tagList || []).slice(0, 3).map((tag) => (
                            <Badge key={tag.tagId} variant="outline" className="text-xs mypost-border tag-blue">
                              {tag.tagName}
                            </Badge>
                          ))}
                          {(post.tagList || []).length > 3 && (
                            <Badge variant="outline" className="text-xs mypost-border tag-blue">
                              +{(post.tagList || []).length - 3}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span>{post.likesNum || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{post.commentsNum || 0}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">暂无文章数据</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">总浏览量</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12,450</div>
                    <p className="text-xs text-muted-foreground">+20.1% 较上月</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">新增关注</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+89</div>
                    <p className="text-xs text-muted-foreground">+15.3% 较上月</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">互动率</CardTitle>
                    <Heart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">8.2%</div>
                    <p className="text-xs text-muted-foreground">+2.1% 较上月</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">分享次数</CardTitle>
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">156</div>
                    <p className="text-xs text-muted-foreground">+12.5% 较上月</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>内容表现</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-muted-foreground py-8">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>详细的数据分析图表将在这里显示</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>账户设置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center text-muted-foreground py-8">
                    <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>账户设置选项将在这里显示</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
