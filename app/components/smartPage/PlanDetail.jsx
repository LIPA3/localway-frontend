import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Clock,
  Loader2 
} from "lucide-react";
import { usePlan } from "../../hooks/useApi";
import "../../css/RecommendResult.css";

// Helper function to parse plan content
const parsePlanContent = (planContent) => {
  try {
    const content = JSON.parse(planContent);
    return content;
  } catch (error) {
    console.error('Error parsing plan content:', error);
    return null;
  }
};

function Stat({ label, value, className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="result-stat-value font-semibold">{value}</div>
      <div className="result-stat-label mt-1">{label}</div>
    </div>
  );
}

function DayCard({ day, dayIndex }) {
  return (
    <Card className="soft-card">
      <CardHeader>
        <CardTitle className="text-base text-orange-600">{day.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {day.items && day.items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-[64px_1fr] gap-4 items-start">
            <div className="text-muted-foreground text-sm leading-6">
              {item.time}
            </div>
            <div className="pb-3 border-b last:border-b-0">
              <div className="font-medium leading-6">
                {item.title}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {item.desc}
              </div>
              {item.location && (
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  {item.location}
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function PlanDetailPage({ planId }) {
  const navigate = useNavigate();
  const userId = 1; // Using userId = 1 as specified
  
  const { data: planData, isLoading, error } = usePlan(planId, userId);
  
  const [parsedPlan, setParsedPlan] = useState(null);

  useEffect(() => {
    if (planData && planData.planContent) {
      const parsed = parsePlanContent(planData.planContent);
      setParsedPlan(parsed);
    }
  }, [planData]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/savedPlan")}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">L</span>
                </div>
                <span className="text-xl font-bold text-orange-500">
                  行程详情
                </span>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader2 className="animate-spin h-12 w-12 text-orange-500 mx-auto mb-4" />
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
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/savedPlan")}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">L</span>
                </div>
                <span className="text-xl font-bold text-orange-500">
                  行程详情
                </span>
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
                无法获取行程详情，请检查网络连接
              </p>
              <Button
                onClick={() => navigate("/savedPlan")}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                返回行程列表
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // No data or parsing failed
  if (!planData || !parsedPlan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/savedPlan")}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">L</span>
                </div>
                <span className="text-xl font-bold text-orange-500">
                  行程详情
                </span>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-gray-400 mb-4">
                <span className="text-4xl">📋</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-500 mb-2">
                暂无数据
              </h3>
              <p className="text-gray-400 mb-4">
                未找到该行程的详细信息
              </p>
              <Button
                onClick={() => navigate("/savedPlan")}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                返回行程列表
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const summary = parsedPlan.summary || {};
  
  return (
    <div className="result-page min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate("/savedPlan")}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">L</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">行程详情</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              创建于 {new Date(planData.createTime).toLocaleString('zh-CN')}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-8 max-w-4xl">
        {/* 概览 */}
        <Card className="soft-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              行程概览
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="soft-card">
                <CardContent className="py-4 flex items-center justify-center">
                  <Stat 
                    label="行程天数" 
                    value={`${summary.days || parsedPlan.days?.length || 0}天`} 
                    className="stat-days" 
                  />
                </CardContent>
              </Card>
              <Card className="soft-card">
                <CardContent className="py-4 flex items-center justify-center">
                  <Stat 
                    label="预计总费用" 
                    value={`¥${summary.budget || 0}`} 
                    className="stat-budget" 
                  />
                </CardContent>
              </Card>
              <Card className="soft-card">
                <CardContent className="py-4 flex items-center justify-center">
                  <Stat 
                    label="出行人数" 
                    value={`${summary.people || 1}人`} 
                    className="stat-people" 
                  />
                </CardContent>
              </Card>
              <Card className="soft-card">
                <CardContent className="py-4 flex items-center justify-center">
                  <Stat 
                    label="体验评分" 
                    value={`${summary.rating || 0}分`} 
                    className="stat-rating" 
                  />
                </CardContent>
              </Card>
            </div>
            {summary.tags && summary.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {summary.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="mypost-border result-tag"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 详细行程 */}
        <Card className="soft-card mb-6">
          <CardHeader className="pb-0">
            <h2 className="text-lg font-medium text-gray-800">
              <span className="inline-block w-1.5 h-6 bg-orange-500 rounded-full mr-2 align-middle" />
              详细行程
            </h2>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {parsedPlan.days && parsedPlan.days.map((day, index) => (
                <DayCard key={index} day={day} dayIndex={index} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 底部操作区 */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <Button 
            variant="outline" 
            onClick={() => navigate("/savedPlan")}
            className="bg-transparent"
          >
            返回列表
          </Button>
        </div>
      </div>
    </div>
  );
}