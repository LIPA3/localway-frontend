import axios from "axios";

// API base configuration
const API_BASE_URL =
  import.meta.env.VITE_RAILWAY_BACKEND || "http://localhost:8080";

export let apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
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

// Export the configured axios instance as default for backward compatibility
export default apiClient;
