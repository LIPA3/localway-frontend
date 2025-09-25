import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Eye,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { usePlans, useDeletePlan } from "../../hooks/useApi";

// Helper function to parse plan content and extract information
const parsePlanContent = (planContent, planId, createTime) => {
  try {
    const content = JSON.parse(planContent);
    const summary = content.summary || {};

    // Extract destination from the first day's items or default
    let destination = "未知目的地";
    if (content.days && content.days.length > 0) {
      const firstDayItems = content.days[0].items || [];
      const locationItem = firstDayItems.find((item) => item.location);
      if (locationItem) {
        // Extract city name from location string (e.g., "北京市东城区" -> "北京")
        const locationMatch =
          locationItem.location.match(/^([^市]+市?)|^([^区]+)/);
        if (locationMatch) {
          destination = locationMatch[1] || locationMatch[2];
          destination = destination.replace("市", "");
        }
      }
    }

    // Generate thumbnail based on destination or use default
    const thumbnails = {
      北京: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      广州: "https://images.unsplash.com/photo-1672891700952-def7c93c3f13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      深圳: "https://images.unsplash.com/photo-1559515068-3a3588702a35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    };

    // Extract highlights from days or tags
    let highlights = [];
    if (summary.tags && Array.isArray(summary.tags)) {
      highlights = summary.tags;
    } else if (content.days && content.days.length > 0) {
      // Extract highlights from day titles or item titles
      highlights = content.days
        .slice(0, 4)
        .map((day) => day.title || `第${content.days.indexOf(day) + 1}天行程`);
    }

    return {
      id: planId.toString(),
      title:
        content.days && content.days.length > 0
          ? `${destination}${summary.days || content.days.length}日游`
          : `${destination}文化深度游`,
      destination,
      duration: `${summary.days || content.days?.length || 3}天${(summary.days || content.days?.length || 3) - 1}晚`,
      cost: summary.budget?.toString() || "0",
      travelers: summary.people?.toString() || "2",
      savedAt: new Date(createTime).toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      thumbnail: thumbnails[destination] || thumbnails["北京"],
      highlights: highlights.slice(0, 4),
      rawContent: content,
    };
  } catch (error) {
    console.error("Error parsing plan content:", error);
    return {
      id: planId.toString(),
      title: "解析失败的行程",
      destination: "未知",
      duration: "未知",
      cost: "0",
      travelers: "1",
      savedAt: new Date(createTime).toLocaleDateString("zh-CN"),
      thumbnail:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      highlights: ["数据解析失败"],
      rawContent: null,
    };
  }
};

export default function SavedItineraries({ onNavigate }) {
  const userId = 1; // Using userId = 1 as specified
  const { data: plansData, isLoading, error, refetch } = usePlans(userId);
  const deleteTimeMutation = useDeletePlan();

  // Transform backend data to component format
  const savedItineraries = useMemo(() => {
    if (!plansData || !Array.isArray(plansData)) return [];

    return plansData.map((plan) =>
      parsePlanContent(plan.planContent, plan.planId, plan.createTime)
    );
  }, [plansData]);

  const handleDeleteItinerary = async (id) => {
    if (confirm("确定要删除这个行程吗？")) {
      try {
        await deleteTimeMutation.mutateAsync({
          planId: parseInt(id),
          userId: userId,
        });
        // The mutation will automatically invalidate and refetch the plans
      } catch (error) {
        console.error("删除行程失败:", error);
        alert("删除行程失败，请稍后重试");
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
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
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-500">加载中...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
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
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-red-500 mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-500 mb-2">
                加载失败
              </h3>
              <p className="text-gray-400 mb-4">
                无法获取行程数据，请检查网络连接
              </p>
              <Button
                onClick={() => refetch()}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                重试
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                          onClick={() =>
                            onNavigate("smartRecommend", {
                              planId: itinerary.id,
                            })
                          }
                          className="bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          查看详情
                        </Button>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteItinerary(itinerary.id)}
                          className="text-red-500 hover:text-red-700"
                          disabled={deleteTimeMutation.isPending}
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
                onClick={() => onNavigate("smartRecommend")}
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
