import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FirstLevelCommentModel } from "../models/CommentModel";
import { commentsApi } from "../service/commentService";

export interface SendComment {
    content: string;
  }
  
  export const useAddComment = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: commentsApi.addComment,
      onMutate: async (newComment: SendComment) => {
        await queryClient.cancelQueries({ queryKey: ['comments'] });
  
        const previousComments = queryClient.getQueryData<
          FirstLevelCommentModel[]
        >(['comments']);
  
        // Optimistically update to the new value
        queryClient.setQueryData(
          ['comments'],
          (old: any) => [
            ...old,
            {
              content: newComment.content,
              createdAt: '1 minute ago',
              id: 1000,
              isEdited: false,
              replies: [],
              score: 3,
              user: {
                image: 'a',
                username: 'Xsan',
              },
            },
          ]
        );
  
        return { previousComments };
      },
      onError: (err, newComment, context) => {
        queryClient.setQueryData(['comments'], context!.previousComments);
      },
  
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['comments'] });
      },
    });
  };
  
  