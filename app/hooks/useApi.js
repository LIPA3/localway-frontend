import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCommentsByArticleId,
  createComment,
  createReply,
  toggleArticleLike,
  likeComment,
  unlikeComment,
  healthCheck,
  getArticles,
  createArticle,
} from "../api/Api";

// Health check hook
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ["health"],
    queryFn: healthCheck,
  });
};

// Articles hooks
export const useArticles = (page, size, keyWord) => {
  return useQuery({
    queryKey: ["articles", page, size, keyWord],
    queryFn: () => getArticles(page, size, keyWord),
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
      // Invalidate any relevant queries that might show like counts
      queryClient.invalidateQueries(["articles"]);
      queryClient.invalidateQueries(["posts"]);
    },
  });
};

// Comment likes hooks
export const useLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likeComment,
    onSuccess: (data, commentId) => {
      // Invalidate comments to refresh like counts
      queryClient.invalidateQueries(["comments"]);
    },
  });
};

export const useUnlikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unlikeComment,
    onSuccess: (data, commentId) => {
      // Invalidate comments to refresh like counts
      queryClient.invalidateQueries(["comments"]);
    },
  });
};
