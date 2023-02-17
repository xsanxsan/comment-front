import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FirstLevelCommentModel, UpVoteDownVote } from "../models/CommentModel";
import { commentsApi } from "../service/commentService";
import deepClone from "../utils/deepClone";

export interface VoteComment {
    votedCommentId: number;
    firstlevelCommentId: number;
    vote: UpVoteDownVote;
  }
  
  export const useVoteComment = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: commentsApi.voteComment,
      onMutate: async (voteComment: VoteComment) => {
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
            if (voteComment.firstlevelCommentId !== voteComment.votedCommentId) {
              const indexOfFirstLevelComment = oldComments!.findIndex(
                (elem) => elem.id === voteComment.firstlevelCommentId
              );
              const indexOfReply = oldComments![
                indexOfFirstLevelComment
              ].replies.findIndex(
                (elem) => elem.id === voteComment.votedCommentId
              );
              newComments[indexOfFirstLevelComment].replies[indexOfReply] = {
                ...oldComments![indexOfFirstLevelComment].replies[indexOfReply],
                score:
                  oldComments![indexOfFirstLevelComment].replies[indexOfReply]
                    .score + voteComment.vote,
              };
            } else {
              const indexOfFirstLevelComment = oldComments!.findIndex(
                (elem) => elem.id === voteComment.votedCommentId
              );
              newComments[indexOfFirstLevelComment] = {
                ...oldComments![indexOfFirstLevelComment],
                score:
                  newComments[indexOfFirstLevelComment].score + voteComment.vote,
              };
            }
  
            return newComments;
          }
        );
  
        return { previousComments };
      },
      onError: (err, newComment, context) => {
        queryClient.setQueryData(['comments'], context!.previousComments);
      },
  
      // Always refetch after error or success:
      onSettled: () => {
        // queryClient.invalidateQueries({ queryKey: ['comments'] });
      },
      retry: false
    });
  };
  