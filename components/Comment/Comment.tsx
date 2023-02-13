import React = require('react');
import styles from './comment.module.css';
import CommentActionButtons from '../Comment/CommentActionButtons/CommentActionsButtons';
import CommentLikeCounter from '../Comment/CommentLikeCounter/CommentLikeCounter';
import CommentHeader from '../Comment/CommentHeader/Commentheader';
import {
  CommentReplyModel,
  FirstLevelCommentModel,
} from '../../models/CommentModel';
import TextArea from '../WritingBox/TextAreaComponent/TextArea';
import WritingBox from '../WritingBox/WritingBox';
import { useAddReply, useEditComment } from '../../service/commentService';

interface Props {
  comment: CommentReplyModel | FirstLevelCommentModel;
  firstLevelCommentId: number;
}

export default function Comment(props: Props) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isReplying, setIsReplying] = React.useState(false);

  let addReply = useAddReply();
  let editComment = useEditComment();
  let editionTextArea = props.comment.content;

  const handleAcceptEdit = () => {
    editComment.mutate({
      comment: editionTextArea,
      editedCommentId: props.comment.id,
      firstlevelCommentId: props.firstLevelCommentId,
    });
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleClickReplyButton = () => {
    setIsReplying(true);
  };

  const handleCancelReply = () => {
    setIsReplying(false);
  };

  const sendReply = (reply: string) => {
    addReply.mutate({
      commentId: props.firstLevelCommentId,
      newComment: reply,
      repliedTo: props.comment.user.username,
    });
    setIsReplying(false);
  };

  const displayComment = () => {
    return (
      <div className={'display-linebreak'}>
        {'replyingTo' in props.comment && (
          <span className={styles.replyingTo}>
            @{props.comment.replyingTo}{' '}
          </span>
        )}
        {props.comment.content}
      </div>
    );
  };

  return (
    <React.Fragment>
      <div className={styles.comment}>
        <div className={styles.mainContentWrapper}>
          <div className={styles.growMax}>
            <CommentHeader
              createdAt={props.comment.createdAt}
              user={props.comment.user}
              handleEdit={handleEdit}
              isEditing={isEditing}
              handleCancelEdit={handleCancelEdit}
              handleAcceptEdit={handleAcceptEdit}
              handleReply={handleClickReplyButton}
            />
            {isEditing ? (
              <TextArea
                onChange={(e) => (editionTextArea = e)}
                initialText={props.comment.content}
              />
            ) : (
              displayComment()
            )}
          </div>

          <div className={styles.footer}>
            <CommentLikeCounter
              score={props.comment.score}
              commentId={props.comment.id}
              firstLevelCommentId={props.firstLevelCommentId}
            />
            <div className={'smallScreen'}>
              <CommentActionButtons
                isEditing={isEditing}
                handleEdit={handleEdit}
                handleCancelEdit={handleCancelEdit}
                handleAcceptEdit={handleAcceptEdit}
                handleReply={handleClickReplyButton}
              />
            </div>
          </div>
        </div>
        {isReplying && (
          <div className={styles.writingBox}>
            <WritingBox
              handleSend={sendReply}
              closable={true}
              handleCancel={handleCancelReply}
            />
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
