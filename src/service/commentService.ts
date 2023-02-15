import {
  FirstLevelCommentModel,
  UpVoteDownVote,
} from '../models/CommentModel';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import deepClone from '../utils/deepClone'
import data from '../data.json'

const BASE_URL = 'http://localhost:8080';

export const commentsApi = {
  getComments: () => 
  new Promise<FirstLevelCommentModel[]>((resolve) => {
    console.log('Fetching comments');
    return resolve(data as FirstLevelCommentModel[]);
  })
    ,
  addComment: (newComment: SendComment) =>
  fetch(BASE_URL + '/comments', {
    method: 'POST',
    body: JSON.stringify(newComment)
  }).then(res => res.json()),
    // new Promise((resolve, reject) => setTimeout(() => resolve('error'), 100)),
  editComment: (editComment: EditComment) =>
  fetch(BASE_URL + `/comments/${editComment.editedCommentId}`, {
    method: 'PUT',
    body: JSON.stringify(editComment)
  }).then(res => res.json()),
    // new Promise((resolve, reject) => setTimeout(() => resolve('error'), 100)),
  addReply: (addReply: AddReply) =>
  fetch(BASE_URL + `/comments/${addReply.commentId}`, {
    method: 'POST',
    body: JSON.stringify(addReply)
  }).then(res => res.json()),
    // new Promise((resolve, reject) => setTimeout(() => resolve('error'), 100)),
  voteComment: (voteComment: VoteComment) =>
  fetch(BASE_URL + `/comments/${voteComment.votedCommentId}`, {
    method: 'POST',
    body: JSON.stringify(voteComment)
  }).then(res => res.json()),
    // new Promise((resolve, reject) => setTimeout(() => resolve('error'), 100)),
};

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

interface SendComment {
  comment: string;
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
            content: newComment.comment,
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
      // queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};

interface EditComment {
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

interface AddReply {
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

      return { previousComments };
    },
    onError: (err, newComment, context) => {
      queryClient.setQueryData(['comments'], context!.previousComments);
    },

    // Always refetch after error or success:
    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};

interface VoteComment {
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
  });
};
