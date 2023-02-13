import React = require('react');
import styles from './first-level-comment.module.css';
import Comment from './Comment';
import { FirstLevelCommentModel } from '../../models/CommentModel';

interface Props {
  comment: FirstLevelCommentModel;
}

export default function FirstLevelComment(props: Props) {

  return (
    <div key={props.comment.id}>
      <Comment
        comment={props.comment}
        firstLevelCommentId={props.comment.id}
      />
      <div className={styles.replyCommentSection}>
        {props.comment.replies.map((reply) => (
          <Comment
            key={reply.id + reply.createdAt}
            comment={reply}
            firstLevelCommentId={props.comment.id}
          />
        ))}
      </div>
    </div>
  );
}
