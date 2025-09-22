"use client"


import { useState } from "react"
import { PenTool, ImageIcon, MapPin, Tag, Save, Send, Plus, X, Upload, Clock, Users, Star } from "lucide-react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Textarea } from "../ui/Textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Label } from "../ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs"

const categories = ["美食文化", "历史人文", "艺术创意", "传统手工", "现代生活", "自然户外", "音乐表演", "建筑设计"]

const locations = ["北京", "上海", "广州", "深圳", "成都", "杭州", "西安", "南京", "武汉", "重庆"]

export function CreatorContentPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState("")
  const [duration, setDuration] = useState("")
  const [maxParticipants, setMaxParticipants] = useState("")
  const [activeTab, setActiveTab] = useState("edit")

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <PenTool className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">创作中心</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                保存草稿
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                <Send className="w-4 h-4 mr-2" />
                发布体验
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit">编辑内容</TabsTrigger>
              <TabsTrigger value="preview">预览效果</TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PenTool className="w-5 h-5" />
                    基本信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">体验标题</Label>
                    <Input
                      id="title"
                      placeholder="为你的体验起一个吸引人的标题..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">体验类别</Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="选择体验类别" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="location">所在城市</Label>
                      <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="选择城市" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration">体验时长</Label>
                      <Input
                        id="duration"
                        placeholder="如：2小时"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="participants">最大人数</Label>
                      <Input
                        id="participants"
                        placeholder="如：6人"
                        value={maxParticipants}
                        onChange={(e) => setMaxParticipants(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Creation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PenTool className="w-5 h-5" />
                    体验描述
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="详细描述你的体验内容，包括：
• 体验的独特之处
• 参与者将学到什么
• 体验的具体流程
• 需要注意的事项
• 为什么选择你作为向导..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                  <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                    <span>建议至少200字，详细的描述能吸引更多用户</span>
                    <span>{content.length} 字</span>
                  </div>
                </CardContent>
              </Card>

              {/* Media Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    图片上传
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">点击上传或拖拽图片到此处</p>
                    <p className="text-sm text-muted-foreground">支持 JPG、PNG 格式，建议尺寸 1200x800px</p>
                    <Button variant="outline" className="mt-4 bg-transparent">
                      选择图片
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    标签设置
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="添加标签，如：咖啡、历史、文化..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button onClick={addTag} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">添加相关标签有助于用户找到你的体验</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              {/* Preview Card */}
              <Card className="max-w-md mx-auto">
                <CardContent className="p-0">
                  {/* Preview Image Placeholder */}
                  <div className="aspect-[4/3] bg-muted rounded-t-lg flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
                  </div>

                  <div className="p-6">
                    {/* Title and Category */}
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg mb-2">{title || "体验标题"}</h3>
                      {selectedCategory && (
                        <Badge variant="secondary" className="text-xs">
                          {selectedCategory}
                        </Badge>
                      )}
                    </div>

                    {/* Location and Details */}
                    <div className="space-y-2 mb-4">
                      {selectedLocation && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {selectedLocation}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {duration}
                          </div>
                        )}
                        {maxParticipants && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            最多{maxParticipants}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description Preview */}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {content
                        ? content.substring(0, 120) + (content.length > 120 ? "..." : "")
                        : "体验描述将在这里显示..."}
                    </p>

                    {/* Tags Preview */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Rating Preview - no price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">新体验</span>
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        地道体验
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center text-sm text-muted-foreground">这是你的体验在用户浏览页面中的显示效果</div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
