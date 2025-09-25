"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import {
  MapPin,
  Calendar,
  Users,
  Wallet,
  ChevronLeft,
  Check,
  Plus,
} from "lucide-react";
import AIChat from "./AiChat";
import "../../css/CreateArticle.css";
import "../../css/RecommendResult.css";

const mockPlan = {
  summary: {
    days: 3,
    budget: 1,
    people: 1,
    rating: 4.8,
    tags: ["城市观光", "历史文化", "特色美食"],
  },
  days: [
    {
      title: "第1天：抵达，市区游",
      items: [
        {
          time: "09:00",
          title: "1号线珠江新城站",
          desc: "感受广州现代都市氛围，了解当地商务文化",
        },
        {
          time: "12:00",
          title: "地道牛杂午餐",
          desc: "品尝经典本地美味，体验道地舌尖文化",
        },
        {
          time: "14:00",
          title: "休闲骑行",
          desc: "沿珠江边漫游，参与友好活动",
        },
        {
          time: "18:00",
          title: "自由活动时间",
          desc: "自由散步、夜赏珠江，体验当地夜生活",
        },
      ],
    },
    {
      title: "第2天：休闲娱乐深度体验",
      items: [
        {
          time: "09:00",
          title: "1号线北京路商圈",
          desc: "逛街和特色市井小店，了解当地历史文化",
        },
        {
          time: "12:00",
          title: "地方特色午餐",
          desc: "尝试经典粤菜，体验道地舌尖文化",
        },
        { time: "14:00", title: "休闲时段", desc: "体验茶文化，参与互动活动" },
        {
          time: "18:00",
          title: "自由活动时间",
          desc: "夜间慢享城市，体验当地生活",
        },
      ],
    },
    {
      title: "第3天：历史文化风光巡游",
      items: [
        {
          time: "09:00",
          title: "1号线陈家祠站",
          desc: "岭南建筑艺术殿堂，了解当地历史文化",
        },
        {
          time: "12:00",
          title: "地方特色午餐",
          desc: "品尝经典本地美味，体验道地舌尖文化",
        },
        { time: "14:00", title: "休闲时段", desc: "公园漫步，参与互动活动" },
        {
          time: "18:00",
          title: "自由活动时间",
          desc: "返程前自由时间，体验当地生活",
        },
      ],
    },
  ],
};

function Stat({ label, value, className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="result-stat-value font-semibold">{value}</div>
      <div className="result-stat-label mt-1">{label}</div>
    </div>
  );
}

function DayCard({ day }) {
  return (
    <Card className="soft-card">
      <CardHeader>
        <CardTitle className="text-base text-orange-600">{day.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {day.items.map((it, idx) => (
          <div
            key={idx}
            className="grid grid-cols-[64px_1fr_20px] gap-4 items-start"
          >
            <div className="text-muted-foreground text-sm leading-6">
              {it.time}
            </div>
            <div className="pb-3 border-b last:border-b-0">
              <div className="font-medium leading-6">{it.title}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {it.desc}
              </div>
            </div>
            <div className="flex items-center justify-end pt-1 result-status-icon">
              {idx % 2 === 0 ? (
                <Check className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function CustomizationResult() {
  const s = mockPlan.summary;
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [updateSuggestion, setUpdateSuggestion] = useState("");

  const handleSubmitUpdate = () => {
    // 这里可以添加提交更新建议的逻辑
    console.log("提交的更新建议:", updateSuggestion);
    // 可以显示一个成功提示或者清空输入框
    setUpdateSuggestion("");
  };

  return (
    <div className="result-page min-h-screen bg-background">
      {/* Header 保持与创作页一致 */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ChevronLeft className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-foreground">
                智能定制结果
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent"
                onClick={() => setIsAIChatOpen(true)}
              >
                编辑
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-8 max-w-4xl mb-2">
        {/* 概览 */}
        <Card className="soft-card mb-6 mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">行程概览</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="soft-card">
                <CardContent className="py-4 flex items-center justify-center">
                  <Stat
                    label="行程天数"
                    value={`${s.days}天`}
                    className="stat-days"
                  />
                </CardContent>
              </Card>
              <Card className="soft-card">
                <CardContent className="py-4 flex items-center justify-center">
                  <Stat
                    label="预计总费用"
                    value={`¥${s.budget}`}
                    className="stat-budget"
                  />
                </CardContent>
              </Card>
              <Card className="soft-card">
                <CardContent className="py-4 flex items-center justify-center">
                  <Stat
                    label="出行人数"
                    value={`${s.people}人`}
                    className="stat-people"
                  />
                </CardContent>
              </Card>
              <Card className="soft-card">
                <CardContent className="py-4 flex items-center justify-center">
                  <Stat
                    label="体验评分"
                    value={`${s.rating}分`}
                    className="stat-rating"
                  />
                </CardContent>
              </Card>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {s.tags.map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="mypost-border result-tag"
                >
                  {t}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 行程更新建议输入框 */}
        <Card className="soft-card mb-6">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 text-blue-500">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21 21L12 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.83 7.83l4.24 4.24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 2H5C3.89543 2 3 2.89543 3 4V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V13"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <CardTitle className="text-base">行程更新建议</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex gap-2">
              <textarea
                className="suggestion-input flex-1 p-2 border border-gray-200 rounded-md"
                placeholder="您希望对行程做哪些调整？比如：增加美食体验、更换住宿类型等..."
                value={updateSuggestion}
                onChange={(e) => setUpdateSuggestion(e.target.value)}
                rows={3}
              />
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white self-end whitespace-nowrap px-4"
                onClick={handleSubmitUpdate}
              >
                提交更新
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 详细行程用卡片包裹 */}
        <Card className="soft-card mb-6">
          <CardHeader className="pb-0">
            <h2 className="text-lg font-medium text-gray-800">
              <span className="inline-block w-1.5 h-6 bg-orange-500 rounded-full mr-2 align-middle" />
              详细行程
            </h2>
          </CardHeader>
          <CardContent className="pt-4">
            {/* 每日行程 */}
            <div className="space-y-4">
              {mockPlan.days.map((d, i) => (
                <div key={i} className="mb-4">
                  <h3 className="text-base font-medium text-orange-500 mb-3">
                    {d.title}
                  </h3>
                  <div className="space-y-3">
                    {d.items.map((it, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 border-b border-gray-100 pb-3"
                      >
                        <div className="w-16 text-sm text-gray-500">
                          {it.time}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium mb-1">{it.title}</div>
                          <div className="text-sm text-gray-500 mb-1">
                            {it.desc}
                          </div>
                        </div>
                        <div className="w-5 text-green-500">
                          <Check className="w-5 h-5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 推荐内容占位 */}
        <Card className="soft-card mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              你可能会喜欢的真实分享
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg border p-3">
                <div className="h-24 bg-muted rounded mb-3" />
                <div className="text-sm font-medium">本地城市体验示例 {i}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  by 某位向导
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 bg-transparent"
                >
                  查看详情
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 底部操作区 */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <Button variant="outline" className="bg-transparent">
            保存行程
          </Button>
        </div>
      </div>

      {/* AI对话框组件 */}
      <AIChat isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </div>
  );
}
