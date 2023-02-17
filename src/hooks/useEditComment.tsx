import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FirstLevelCommentModel } from "../models/CommentModel";
import { commentsApi } from "../service/commentService";
import deepClone from "../utils/deepClone";

export interface EditComment {
    editedCommentId: number;
    firstlevelCommentId: number;
    comment: string;
  }
  
  export const useEditComment = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: commentsApi.editComment,
      onMutate: async (editComment: EditComment) => {
        await queryClient.cancelQueries({ queryKey: ['comments'] });
  
        const previousComments = queryClient.getQueryData<
          FirstLevelCommentModel[]
        >(['comments']);
  
        // Optimistically update to the new value
        queryClient.setQueryData<FirstLevelCommentModel[]>(
          ['comments'],
          (oldComments) => {
            const newComments = deepClone(oldComments!);
            console.log(newComments);
            if (editComment.firstlevelCommentId !== editComment.editedCommentId) {
              const indexOfFirstLevelComment = oldComments!.findIndex(
                (elem) => elem.id === editComment.firstlevelCommentId
              );
              const indexOfReply = oldComments![
                indexOfFirstLevelComment
              ].replies.findIndex(
                (elem) => elem.id === editComment.editedCommentId
              );
              newComments[indexOfFirstLevelComment].replies[indexOfReply] = {
                ...oldComments![indexOfFirstLevelComment].replies[indexOfReply],
                content: editComment.comment,
                isEdited: true,
              };
            } else {
              const indexOfFirstLevelComment = oldComments!.findIndex(
                (elem) => elem.id === editComment.editedCommentId
              );
              newComments[indexOfFirstLevelComment] = {
                ...oldComments![indexOfFirstLevelComment],
                content: editComment.comment,
                isEdited: true,
              };
            }
  
            return newComments;
          }
        );
  
        return { previousComments };
      },
      onError: (err, editComment, context) => {
        queryClient.setQueryData(['comments'], context!.previousComments);
      },
      // Always refetch after error or success:
      onSettled: () => {
        // queryClient.invalidateQueries({ queryKey: ['comments'] });
      },
    });
  };
  
  