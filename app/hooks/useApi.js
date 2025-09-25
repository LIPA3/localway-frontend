import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCommentsByArticleId,
  createComment,
  createReply,
  toggleArticleLike,
  likeComment,
  unlikeComment,
  getArticles,
  getArticleById,
  createArticle,
  getArticlesByCreatorId,
  getUserInfo,
  getUserLikedArticles,
  getUserLikedComments,
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
} from "../api/Api";

// Articles hooks
export const useArticles = (page, size, keyWord, author) => {
  return useQuery({
    queryKey: ["articles", page, size, keyWord, author],
    queryFn: () => getArticles(page, size, keyWord, author),
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      // Invalidate articles to refresh the list
      queryClient.invalidateQueries(["articles"]);
    },
  });
};

export const useArticlesByCreatorId = (creatorId) => {
  return useQuery({
    queryKey: ["articles", "creator", creatorId],
    queryFn: () => getArticlesByCreatorId(creatorId),
    enabled: !!creatorId,
  });
};

// Users hooks
export const useUserInfo = (userId) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserInfo(userId),
    enabled: !!userId,
  });
};

export const useUserLikedArticles = (userId) => {
  return useQuery({
    queryKey: ["likes/articles", userId],
    queryFn: () => getUserLikedArticles(userId),
    enabled: !!userId,
  });
};

export const useUserLikedComments = (userId) => {
  return useQuery({
    queryKey: ["likes/comments", userId],
    queryFn: () => getUserLikedComments(userId),
    enabled: !!userId,
  });
};

// Comments hooks
export const useComments = (articleId) => {
  return useQuery({
    queryKey: ["comments", articleId],
    queryFn: () => getCommentsByArticleId(articleId),
    enabled: !!articleId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: (data, variables) => {
      // Invalidate and refetch comments for the article
      queryClient.invalidateQueries(["comments", variables.articleId]);
    },
  });
};

export const useCreateReply = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReply,
    onSuccess: (data, variables) => {
      // Invalidate and refetch comments for the article
      queryClient.invalidateQueries(["comments"]);
    },
  });
};

// Article likes hooks
export const useToggleArticleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ articleId, likeData }) =>
      toggleArticleLike(articleId, likeData),
    onSuccess: () => {
      // Invalidate user liked articles to refresh the state
      queryClient.invalidateQueries(["likes/articles"]);
    },
  });
};

// Comment likes hooks
export const useLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, commentLikeRequest }) =>
      likeComment(commentId, commentLikeRequest),
    onSuccess: () => {
      // Invalidate user liked comments to refresh the state
      queryClient.invalidateQueries(["likes/comments"]);
      // Also invalidate comments to refresh like counts
      queryClient.invalidateQueries(["comments"]);
    },
  });
};

export const useUnlikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, commentLikeRequest }) =>
      unlikeComment(commentId, commentLikeRequest),
    onSuccess: () => {
      // Invalidate user liked comments to refresh the state
      queryClient.invalidateQueries(["likes/comments"]);
      // Also invalidate comments to refresh like counts
      queryClient.invalidateQueries(["comments"]);
    },
  });
};

// Plans hooks
export const usePlans = (userId) => {
  return useQuery({
    queryKey: ["plans", userId],
    queryFn: () => getPlans(userId),
    enabled: !!userId,
  });
};

export const usePlan = (planId, userId) => {
  return useQuery({
    queryKey: ["plan", planId, userId],
    queryFn: () => getPlan(planId, userId),
    enabled: !!planId && !!userId,
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPlan,
    onSuccess: () => {
      // Invalidate plans to refresh the list
      queryClient.invalidateQueries(["plans"]);
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, planData }) => updatePlan(planId, planData),
    onSuccess: () => {
      // Invalidate plans to refresh the list
      queryClient.invalidateQueries(["plans"]);
      queryClient.invalidateQueries(["plan"]);
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ planId, userId }) => deletePlan(planId, userId),
    onSuccess: () => {
      // Invalidate plans to refresh the list
      queryClient.invalidateQueries(["plans"]);
    },
  });
};
