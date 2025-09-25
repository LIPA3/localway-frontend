import axios from "axios";

// API base configuration
const API_BASE_URL =
   "http://localhost:8080";

export let apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

apiClient.interceptors.response.use(
  (response) => {
    // handle response
    return response;
  },
  (error) => {
    // handle response error
    const { status, data } = error.response;
    console.log(status, data);

    if (status === 404) {
      alert("请求的资源不存在");
    }
    return Promise.reject(error);
  }
);

// Health check
export const healthCheck = async () => {
  const response = await apiClient.get("/health");
  return response.data;
};

// Chat with AI
export const chatWithAI = async (message) => {
  try {
    // 使用POST请求，将消息作为JSON对象发送
    const response = await apiClient.post("/chat", { message });
    
    // 直接返回响应数据，并进行基本格式化
    let content = response.data;
    
    // 处理特殊字符和换行符
    content = content
      .replace(/\*/g, "") // 移除星号
      .replace(/\\n/g, "\n\n") // 将 \n 转换为真正的换行符
      .replace(/\t/g, "    "); // 将制表符转换为空格
    
    return content;
  } catch (error) {
    console.error('API调用失败:', error);
    throw error;
  }
};

// Articles API
export const getArticles = async (page, size, keyWord, author) => {
  const params = new URLSearchParams();
  if (page !== undefined) params.append("page", page);
  if (size !== undefined) params.append("size", size);
  if (keyWord) params.append("keyWord", keyWord);
  if (author !== undefined) params.append("author", author);

  const response = await apiClient.get(
    `/articles/queryPage?${params.toString()}`
  );
  return response.data;
};

export const createArticle = async (articleData) => {
  const response = await apiClient.post("/articles", {
    creatorId: articleData.creatorId,
    title: articleData.title,
    address: articleData.address,
    content: articleData.content,
    image: articleData.image,
    tags: articleData.tags || [],
  });
  return response.data;
};

export const getArticlesByCreatorId = async (creatorId) => {
  const response = await apiClient.get(`/articles/${creatorId}`);
  return response.data;
};

// Users API
export const getUserInfo = async (userId) => {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
};

export const getUserLikedArticles = async (userId) => {
  const response = await apiClient.get(`/likes/articles/${userId}`);
  return response.data;
};

// Get user's liked comments
export const getUserLikedComments = async (userId) => {
  const response = await apiClient.get(`/likes/comments/${userId}`);
  return response.data;
};

// Comments API
export const getCommentsByArticleId = async (articleId) => {
  const response = await apiClient.get(`/comments/${articleId}`);
  return response.data;
};

export const createComment = async (commentData) => {
  const response = await apiClient.post("/comments", {
    commentatorId: commentData.commentatorId,
    articleId: commentData.articleId,
    content: commentData.content,
  });
  return response.data;
};

export const createReply = async (replyData) => {
  const response = await apiClient.post("/comments/reply", {
    replierId: replyData.replierId,
    commentId: replyData.commentId,
    content: replyData.content,
  });
  return response.data;
};

// Article likes API
export const toggleArticleLike = async (articleId, likeData) => {
  const response = await apiClient.post(
    `/likes/articles/${articleId}`,
    likeData
  );
  return response.data;
};

// Comment likes API
export const likeComment = async (commentId, commentLikeRequest) => {
  const response = await apiClient.post(
    `/likes/comments/${commentId}`,
    commentLikeRequest
  );
  return response.data;
};

export const unlikeComment = async (commentId, commentLikeRequest) => {
  const response = await apiClient.delete(`/likes/comments/${commentId}`, {
    data: commentLikeRequest,
  });
  return response.data;
};

export const aiGenerateRoute = async (payload) => {
  const response = await apiClient.post('/custom-trips', payload);
  return response;
};

// Update itinerary/plan item API - backend should accept PATCH to /plans/items/{itemId}
export const updatePlanItem = async (itemId, updateData) => {
  // updateData may contain { time, title, desc }
  const response = await apiClient.patch(`/plans/items/${itemId}`, updateData);
  return response.data;
};

// Export the configured axios instance as default for backward compatibility
export default apiClient;

// Plans API
export const getPlans = async (userId) => {
  const response = await apiClient.get(`/plans?userId=${userId}`);
  return response.data;
};

export const getPlan = async (planId, userId) => {
  const response = await apiClient.get(`/plans/${planId}?userId=${userId}`);
  return response.data;
};

export const createPlan = async (planData) => {
  const response = await apiClient.post("/plans", planData);
  return response.data;
};

export const updatePlan = async (planId, planData) => {
  const response = await apiClient.put(`/plans/${planId}`, planData);
  return response.data;
};

export const deletePlan = async (planId, userId) => {
  const response = await apiClient.delete(`/plans/${planId}`, {
    data: userId
  });
  return response.data;
};

export const getArticleById = async (articleId) => {
  const response = await apiClient.get(`/articles/getById/${articleId}`);
  return response.data;
};
