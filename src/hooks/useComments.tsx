import { useQuery } from "@tanstack/react-query";
import { FirstLevelCommentModel } from "../models/CommentModel";
import { commentsApi } from "../service/commentService";

export const useComments = (): {
    isLoading: boolean;
    isError: boolean;
    comments: FirstLevelCommentModel[];
    error: any;
  } => {
    const {
      isLoading,
      isError,
      data: comments,
      error,
    } = useQuery(['comments'], commentsApi.getComments, {
      refetchOnWindowFocus: false,
    });
  
    return {
      isLoading,
      isError,
      comments: comments ?? [],
      error,
    };
  };
  