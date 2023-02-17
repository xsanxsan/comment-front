import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FirstLevelCommentModel } from "../models/CommentModel";
import { commentsApi } from "../service/commentService";
import deepClone from "../utils/deepClone";

export interface DeleteComment {
    deletedCommentId: number;
    firstlevelCommentId: number;
}


export const useDeleteComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: commentsApi.deleteComment,
        onMutate: async (deleteComment: DeleteComment) => {
            await queryClient.cancelQueries({ queryKey: ['comments'] });

            const previousComments = queryClient.getQueryData<
                FirstLevelCommentModel[]
            >(['comments']);

            // Optimistically update to the new value
            queryClient.setQueryData<
                FirstLevelCommentModel[]
            >(
                ['comments'],
                (old) => {
                    console.log("old", old)
                    let values = deepClone(old)
                    if (deleteComment.deletedCommentId === deleteComment.firstlevelCommentId) {
                        values?.splice(values?.findIndex(elem => elem.id === deleteComment.deletedCommentId), 1)
                    } else {
                        let firstLevelIndex = values?.findIndex(elem => elem.id === deleteComment.firstlevelCommentId);
                        firstLevelIndex && values?.splice(values[firstLevelIndex].replies.findIndex(elem => elem.id === deleteComment.deletedCommentId), 1)
                    }
                    console.log("values", values)
                    return values
                }
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
