"use client"

import { useState } from "react"
import axios from "axios"
import { PenTool, ImageIcon, MapPin, Tag, Save, Send, Plus, X, Upload, Clock, Users, Star } from "lucide-react"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Textarea } from "../ui/Textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Label } from "../ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs"
import "../../css/CreateArticle.css"

const locations = ["北京", "上海", "广州", "深圳", "成都", "杭州", "西安", "南京", "武汉", "重庆"]

export function CreatorContentPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState("")
  const [duration, setDuration] = useState("")
  // const [maxParticipants, setMaxParticipants] = useState("")
  const [activeTab, setActiveTab] = useState("edit")
  
  // 图片上传相关状态
  const [uploadedImages, setUploadedImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  // 发布相关状态
  const [publishing, setPublishing] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)

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

  // 图片上传函数
  const handleImageUpload = async (file) => {
    // 检查图片数量限制
    if (uploadedImages.length >= 9) {
      alert('最多只能上传9张图片')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'experience') // 体验图片类型
      
      const response = await axios.post('http://localhost:8080/oss/uploadImg', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          setUploadProgress(percentCompleted)
        },
      })

      if (response.data.success) {
        const newImage = {
          id: Date.now(),
          url: response.data.url,
          name: file.name,
          size: file.size
        }
        setUploadedImages(prev => [...prev, newImage])
        console.log('图片上传成功:', response.data.url)
      } else {
        throw new Error(response.data.message || '上传失败')
      }
    } catch (error) {
      console.error('图片上传失败:', error)
      alert('图片上传失败: ' + (error.response?.data?.message || error.message))
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  // 处理文件选择
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)

    
    files.forEach(file => {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        alert('请选择图片文件')
        return
      }
      
      // 验证文件大小 (5MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('图片大小不能超过5MB')
        return
      }
      
      handleImageUpload(file)
    })
  }

  // 删除图片
  const removeImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId))
  }

  // 发布体验函数
  const handlePublishExperience = async () => {
    // 验证必填字段
    if (!title.trim()) {
      alert('请输入体验标题')
      return
    }
    
    if (!content.trim()) {
      alert('请输入体验描述')
      return
    }
    
    if (!selectedLocation) {
      alert('请选择所在城市')
      return
    }
    
    // 可选：图片验证（如果要求必须有图片，可以取消注释）
    // if (uploadedImages.length === 0) {
    //   alert('请至少上传一张图片')
    //   return
    // }

    setPublishing(true)
    
    try {
      const experienceData = {
        creatorId: 1, // TODO: 替换为实际用户ID
        title: title.trim(),
        content: content.trim(),
        location: selectedLocation,
        // category: selectedCategory,
        tags: [
          { tagName: "a" },
          { tagName: "c" }
        ],
        images: "string",
        // duration: duration,
        // status: 'published', // 发布状态
        createdAt: new Date().toISOString()
      }

      const response = await axios.post('http://localhost:8080/articles', experienceData, {
        headers: {
          'Content-Type': 'application/json',
          // 如果需要认证，添加 Authorization header
          // 'Authorization': `Bearer ${token}`
        }
      })

      if (response.data.success) {
        setPublishSuccess(true)
        alert('体验发布成功！')
        
        // 重置表单或跳转到体验详情页
        // 可以根据需要导航到发布成功页面
        console.log('发布成功，体验ID:', response.data.experienceId)
        
        // 清空表单
        setTitle('')
        setContent('')
        setSelectedCategory('')
        setSelectedLocation('')
        setTags([])
        setUploadedImages([])
        setDuration('')
        
      } else {
        throw new Error(response.data.message || '发布失败')
      }
      
    } catch (error) {
      console.error('发布体验失败:', error)
      
      if (error.response) {
        // 服务器返回错误响应
        const errorMessage = error.response.data?.message || '发布失败，请重试'
        alert(`发布失败: ${errorMessage}`)
      } else if (error.request) {
        // 网络错误
        alert('网络连接失败，请检查网络后重试')
      } else {
        // 其他错误
        alert('发布失败: ' + error.message)
      }
    } finally {
      setPublishing(false)
    }
  }

  // 拖拽上传处理
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = Array.from(e.dataTransfer.files)
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        handleImageUpload(file)
      }
    })
  }

  return (
    <div className="create-article min-h-screen bg-background">
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
              {/* <Button variant="outline" size="sm" onClick={handleSaveDraft}>
                <Save className="w-4 h-4 mr-2" />
                保存草稿
              </Button> */}
              <Button 
                size="sm" 
                className="bg-primary hover:bg-primary/90"
                onClick={handlePublishExperience}
                disabled={publishing}
              >
                <Send className="w-4 h-4 mr-2" />
                {publishing ? '发布中...' : '发布体验'}
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
              <Card className="soft-card">
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
                </CardContent>
              </Card>

              {/* Content Creation */}
              <Card className="soft-card">
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
              <Card className="soft-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    图片上传
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="upload-dropzone border-2 border-dashed border-border rounded-lg p-8 text-center"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">点击上传或拖拽图片到此处</p>
                    <p className="text-sm text-muted-foreground">支持 JPG、PNG 格式，最大5MB，最多9张图片</p>
                    <p className="text-sm text-muted-foreground">建议尺寸 1200x800px</p>
                    
                    <input
                      type="file"
                      id="imageUpload"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    
                    <Button 
                      variant="outline" 
                      className="mt-4 bg-transparent"
                      onClick={() => document.getElementById('imageUpload').click()}
                      disabled={uploading || uploadedImages.length >= 9}
                    >
                      {uploading 
                        ? `上传中 ${uploadProgress}%` 
                        : uploadedImages.length >= 9 
                          ? '已达上限(9张)'
                          : `选择图片 (${uploadedImages.length}/9)`
                      }
                    </Button>
                  </div>

                  {/* 上传进度条 */}
                  {uploading && (
                    <div className="mt-4">
                      <div className="w-full bg-muted rounded-full progress-bar">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* 已上传的图片列表 */}
                  {uploadedImages.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-3">
                        已上传的图片 ({uploadedImages.length}/9)
                        {uploadedImages.length >= 9 && (
                          <span className="text-orange-600 ml-2">已达上限</span>
                        )}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {uploadedImages.map((image) => (
                          <div key={image.id} className="image-item relative group">
                            <img
                              src={image.url}
                              alt={image.name}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <button
                              onClick={() => removeImage(image.id)}
                              className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            <div className="mt-1 text-xs text-muted-foreground truncate">
                              {image.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Tags */}
              <Card className="soft-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="w-5 h-5" />
                    标签设置
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1 mypost-border tag-blue">
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
                      <Badge variant="secondary" className="text-xs mypost-border">
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
{/* 
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
                      </div> */}
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
                          <Badge key={tag} variant="outline" className="text-xs mypost-border tag-blue">
                            {tag}
                          </Badge>
                        ))}
                        {tags.length > 3 && (
                          <Badge variant="outline" className="text-xs mypost-border tag-blue">
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
