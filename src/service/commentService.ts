import { FirstLevelCommentModel } from '../models/CommentModel';
import axios from 'axios';
import { EditComment } from '../hooks/useEditComment';
import { AddReply } from '../hooks/useAddReply';
import { VoteComment } from '../hooks/useVoteComment';
import { SendComment } from '../hooks/useAddComment';
import { DeleteComment } from '../hooks/useDeleteComment';

const BASE_URL = 'http://localhost:8080';

export const commentsApi = {
  getComments: () =>
    axios.get<FirstLevelCommentModel[]>(BASE_URL + '/comments').then(res => res.data),
  addComment: (newComment: SendComment) =>
    axios.post(BASE_URL + '/comments', newComment),
  deleteComment: (deleteComment: DeleteComment) => {
    if (deleteComment.deletedCommentId === deleteComment.firstlevelCommentId) {
      return axios.delete(BASE_URL + `/comments/${deleteComment.deletedCommentId}`)
    } else {
      return axios.delete(BASE_URL + `/comments/${deleteComment.firstlevelCommentId}/replies/${deleteComment.deletedCommentId}`)
    }
  },
  editComment: (editComment: EditComment) =>
    axios.put(BASE_URL + `/comments/${editComment.editedCommentId}`, editComment),
  addReply: (addReply: AddReply) =>
    axios.post(BASE_URL + `/comments/${addReply.commentId}/replies`, addReply),
  voteComment: (voteComment: VoteComment) =>
    axios.post(BASE_URL + `/comments/${voteComment.votedCommentId}`, voteComment),
};