import * as React from 'react';
import FirstLevelComment from './Comment/FirstLevelComment';
import WritingBox from './WritingBox/WritingBox';
import {
  useAddComment,
  useComments,
  useEditComment,
} from '../service/commentService';
import styles from './comment-section.module.css';

export default function ComentSection() {
  let { comments, isLoading } = useComments();
  let addComment = useAddComment();

  const handleAcceptEdit = (
    newComment: string,
    commentId: number,
    firstlevelCommentId: number
  ) => {
    editComment.mutate({
      comment: newComment,
      editedCommentId: commentId,
      firstlevelCommentId: firstlevelCommentId,
    });
  };

  const handleSendComment = (newComment: string) => {
    addComment.mutate({ comment: newComment });
  };

  if (isLoading) {
    return <h1>IsLoading</h1>;
  }

  return (
    <div className={styles.mainContent}>
      {comments.map((comment) => (
        <FirstLevelComment
          key={comment.id}
          comment={comment}
          handleAcceptEdit={handleAcceptEdit}
        />
      ))}
      <WritingBox handleSend={handleSendComment} />
    </div>
  );
}
