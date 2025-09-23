import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCommentsByArticleId,
  createComment,
  createReply,
  toggleArticleLike,
  likeComment,
  unlikeComment,
  getArticles,
  createArticle,
  getArticlesByCreatorId,
  getUserInfo,
  getUserLikedArticles,
  getUserLikedComments,
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

export const useUserLikedComments = (userId) => {
  return useQuery({
    queryKey: ["likes/comments", userId],
    queryFn: () => getUserLikedComments(userId),
    enabled: !!userId,
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
    },
  });
};

// Comment likes hooks
export const useLikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, userId }) => likeComment(commentId, userId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["comments"]);
      queryClient.invalidateQueries(["likes/comments", variables.userId]);
    },
  });
};

export const useUnlikeComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, userId }) => unlikeComment(commentId, userId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["comments"]);
      queryClient.invalidateQueries(["likes/comments", variables.userId]);
    },
  });
};

