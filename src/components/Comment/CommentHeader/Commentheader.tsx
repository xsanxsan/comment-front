import { FirstLevelCommentModel } from '../../../models/CommentModel';
import CommentActionButtons from '../../Comment/CommentActionButtons/CommentActionsButtons';
import ProfileBubble from '../../ProfileBubble/ProfileBubble';
import styles from './comment-header.module.css';

interface Props {
  user: FirstLevelCommentModel['user'];
  createdAt: string;
  firstLevelCommentId: number;
  commentId: number;
  handleEdit: () => void;
  isEditing: boolean;
  handleCancelEdit: () => void;
  handleAcceptEdit: () => void;
  handleReply: () => void;
}

export default function CommentHeader(props: Props) {
  return (
    <div className={styles.headerWrapper}>
      <div className={styles.commentHeader}>
        <ProfileBubble />
        <div className={styles.userName}>{props.user.username}</div>
        <div className={styles.you}>you</div>
        <div className={styles.time}>{props.createdAt}</div>
      </div>
      <div className={'largeScreen'}>
        <CommentActionButtons
          commentId={props.commentId}
          firstlevelCommentId={props.firstLevelCommentId}
          isEditing={props.isEditing}
          handleEdit={props.handleEdit}
          handleCancelEdit={props.handleCancelEdit}
          handleAcceptEdit={props.handleAcceptEdit}
          handleReply={props.handleReply}
        />
      </div>
    </div>
  );
}
