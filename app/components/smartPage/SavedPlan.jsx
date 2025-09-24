import React, { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Eye,
  Download,
  Share2,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";

const mockSavedItineraries = [
  {
    id: "1",
    title: "广州文化深度游",
    destination: "广州",
    duration: "3天2晚",
    cost: "4800",
    travelers: "2",
    savedAt: "2024年1月15日",
    thumbnail:
      "https://images.unsplash.com/photo-1672891700952-def7c93c3f13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGNoaW5lc2UlMjB0ZWElMjBjZXJlbW9ueXxlbnwxfHx8fDE3NTg1NDM0ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    highlights: [
      "陈家祠堂建筑艺术",
      "荔湾湖茶文化体验",
      "沙面岛历史漫步",
      "西关大屋探秘",
    ],
  },
];

export default function SavedItineraries({ onNavigate }) {
  const [savedItineraries, setSavedItineraries] =
    useState(mockSavedItineraries);

  const handleDeleteItinerary = (id) => {
    if (confirm("确定要删除这个行程吗？")) {
      setSavedItineraries((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleShareItinerary = (itinerary) => {
    // 模拟分享功能
    alert(`已复制 "${itinerary.title}" 的分享链接到剪贴板`);
  };

  const handleDownloadItinerary = (itinerary) => {
    // 模拟下载功能
    alert(`正在下载 "${itinerary.title}" 的详细行程单...`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => onNavigate("smart")}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">L</span>
                </div>
                <span className="text-xl font-bold text-orange-500">
                  保存的行程
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {savedItineraries.length > 0 ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                我的行程收藏
              </h2>
              <span className="text-sm text-gray-500">
                {savedItineraries.length} 个行程
              </span>
            </div>

            {savedItineraries.map((itinerary) => (
              <Card
                key={itinerary.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img
                      src={itinerary.thumbnail}
                      alt={itinerary.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {itinerary.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 space-x-4 mb-3">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {itinerary.destination}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {itinerary.duration}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {itinerary.travelers}人
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />¥
                            {itinerary.cost}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">保存于</p>
                        <p className="text-sm font-medium text-gray-700">
                          {itinerary.savedAt}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        行程亮点：
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {itinerary.highlights.map((highlight, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-orange-100 text-orange-700 text-xs"
                          >
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => onNavigate("smart")}
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          查看详情
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadItinerary(itinerary)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          下载
                        </Button>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleShareItinerary(itinerary)}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteItinerary(itinerary.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-500 mb-2">
                暂无保存的行程
              </h3>
              <p className="text-gray-400 mb-4">
                使用智能定制功能创建行程后，可以在这里查看和管理
              </p>
              <Button
                onClick={() => onNavigate("smart")}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                开始定制行程
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
