import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FirstLevelCommentModel } from "../models/CommentModel";
import { commentsApi } from "../service/commentService";
import deepClone from "../utils/deepClone";

export interface AddReply {
    newComment: string;
    commentId: number;
    repliedTo: string;
  }

export const useAddReply = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: commentsApi.addReply,
      onMutate: async (addReply: AddReply) => {
        await queryClient.cancelQueries({ queryKey: ['comments'] });
  
        
        const previousComments = queryClient.getQueryData<
          FirstLevelCommentModel[]
        >(['comments']);
        console.log('previousComments', previousComments)
        let newComments = deepClone(previousComments!);
  
        const index = previousComments!.findIndex(
          (elem) => elem.id === addReply.commentId
        );
  
        let newCommentModel = {
          id: 1,
          content: addReply.newComment,
          createdAt: '1 minute ago',
          score: 3,
          replyingTo: addReply.repliedTo,
          user: {
            image: {
              png: './images/avatars/image-amyrobson.png',
              webp: './images/avatars/image-amyrobson.webp',
            },
            username: 'Xsan',
          },
          isEdited: false,
        };
  
        newComments[index].replies.push(newCommentModel);
  
        // Optimistically update to the new value
        queryClient.setQueryData(
          ['comments'],
          () => newComments
        );
  
        console.log("test")
        return { previousComments };
      },
      onError: (err, newComment, context) => {
        queryClient.setQueryData(['comments'], context!.previousComments);
      },
      // Always refetch after error or success:
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: ['comments'] });
      },
      retry: false
    });
  };
  
  