"use client"

import { useState } from "react"
import axios from "axios"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Textarea } from "../ui/Textarea"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Label } from "../ui/Label"
import { Badge } from "../ui/Badge"
import { MapPin, Calendar, Users, Wallet, Send, Save } from "lucide-react"
import "../../css/CreateArticle.css"
import { aiGenerateRoute } from "../../api/Api"

const featurePresets = [
  { key: "relax", emoji: "🌿", title: "轻松悠闲", desc: "慢节奏，重体验" },
  { key: "deep", emoji: "🔎", title: "深度探索", desc: "文化深入，历史挖掘" },
  { key: "adventure", emoji: "⚡", title: "刺激冒险", desc: "户外运动，挑战自我" },
  { key: "food", emoji: "🍜", title: "美食之旅", desc: "品尝当地，寻味之旅" },
  { key: "photo", emoji: "📷", title: "摄影采风", desc: "记录美景，创作之旅" },
  { key: "family", emoji: "👨‍👩‍👧", title: "亲子时光", desc: "家庭友好，老少皆宜" },
]

export default function TravelCustomization() {
  const [demand, setDemand] = useState("")
  const [fromCity, setFromCity] = useState("")
  const [toCity, setToCity] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [people, setPeople] = useState("")
  const [budget, setBudget] = useState("")
  const [features, setFeatures] = useState([])

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [wechat, setWechat] = useState("")

  const [submitting, setSubmitting] = useState(false)

  const toggleFeature = (key) => {
    setFeatures((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const validate = () => {
    if (!demand.trim()) return "请描述您的需求"
    if (!toCity.trim()) return "请输入目的地"
    if (!startDate || !endDate) return "请选择出发与返程日期"
    if (new Date(startDate) > new Date(endDate)) return "返程日期需晚于出发日期"
    if (!people) return "请输入出行人数"
    if (!name.trim()) return "请输入姓名"
    if (!phone.trim()) return "请输入联系方式"
    return null
  }

  const handleSubmit = async () => {
    const error = validate()
    if (error) {
      alert(error)
      return
    }
    setSubmitting(true)
    try {
      const payload = {
        demand: demand.trim(),
        fromCity: fromCity.trim(),
        toCity: toCity.trim(),
        startDate,
        endDate,
        people: Number(people),
        budget: budget ? Number(budget) : null,
        features,
        contact: { name: name.trim(), phone: phone.trim(), wechat: wechat.trim() },
        createdAt: new Date().toISOString(),
      }
      const res = await aiGenerateRoute(payload)
    
      if (res.data) {
        console.log("AI生成的行程建议:", res.data)
        // 将结果存入 sessionStorage，跳转到结果页后由结果页读取并展示
        try {
          sessionStorage.setItem('smartRecommendResult', JSON.stringify(res.data));
        } catch (err) {
          console.error('保存行程结果到 sessionStorage 失败：', err)
        }
        // 跳转到结果页
        window.location.href = '/smartRecommend/result';
        //重置表单
        // setDemand("")
        // setFromCity("")
        // setToCity("")
        // setStartDate("")
        // setEndDate("")
        // setPeople("")
        // setBudget("")
        // setFeatures([])
        // setName("")
        // setPhone("")
        // setWechat("")
      } else {
        throw new Error(res.data?.message || "提交失败")
      }
    } catch (e) {
      alert("提交失败：" + (e.response?.data?.message || e.message))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="create-article min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">行程定制</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="bg-transparent">
              <Save className="w-4 h-4 mr-2" />保存草稿
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={handleSubmit} disabled={submitting}>
              <Send className="w-4 h-4 mr-2" />{submitting ? "提交中..." : "提交定制需求"}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* 1. 需求描述 */}
        <Card className="soft-card mb-6">
          <CardHeader>
            <CardTitle>1. 告诉我们您的需求</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="描述您想要的旅行体验，例如：想去广州体验茶文化，了解传统建筑..."
              value={demand}
              onChange={(e) => setDemand(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </CardContent>
        </Card>

        {/* 2. 基础需求框架 */}
        <Card className="soft-card mb-6">
          <CardHeader>
            <CardTitle>2. 基础需求框架</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>出发地</Label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <Input placeholder="请输入出发城市" value={fromCity} onChange={(e) => setFromCity(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>目的地</Label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <Input placeholder="请输入目的地" value={toCity} onChange={(e) => setToCity(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>预计出游日期</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>预计返程日期</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>预计出行人数</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <Input type="number" min="1" placeholder="请输入人数" value={people} onChange={(e) => setPeople(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>预估预算</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  <Input type="number" min="0" placeholder="请输入预算（元）" value={budget} onChange={(e) => setBudget(e.target.value)} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. 特色定制 */}
        <Card className="soft-card mb-6">
          <CardHeader>
            <CardTitle>3. 特色定制</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">选择您希望的出行方式（可多选）</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featurePresets.map((f) => {
                const active = features.includes(f.key)
                return (
                  <button
                    key={f.key}
                    onClick={() => toggleFeature(f.key)}
                    className={`text-left rounded-lg border p-4 transition-colors soft-card ${
                      active ? "border-primary ring-2 ring-primary/20" : "hover:border-primary/40"
                    }`}
                  >
                    <div className="text-3xl mb-2">{f.emoji}</div>
                    <div className="font-medium mb-1">{f.title}</div>
                    <div className="text-sm text-muted-foreground">{f.desc}</div>
                    {active && (
                      <Badge variant="secondary" className="mt-3">已选择</Badge>
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* 4. 联系人信息 */}
        <Card className="soft-card mb-6">
          <CardHeader>
            <CardTitle>4. 联系人信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>姓名</Label>
                <Input className="mt-1" placeholder="请输入您的姓名" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label>联系方式</Label>
                <Input className="mt-1" placeholder="请输入手机号" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <Label>微信号</Label>
                <Input className="mt-1" placeholder="请输入微信号" value={wechat} onChange={(e) => setWechat(e.target.value)} />
              </div>
            </div>
            <div className="text-xs text-muted-foreground">提交后，我们的AI将为您做个性化行程方案，专业旅行顾问将在24小时内与您联系。</div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="outline" className="bg-transparent">
                保存草稿
              </Button>
              <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90" disabled={submitting}>
                {submitting ? "提交中..." : "提交定制需求"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
