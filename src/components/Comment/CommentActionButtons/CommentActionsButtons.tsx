import styles from './comment-actions-buttons.module.css';
import { FaReply } from 'react-icons/fa';
import { RiEdit2Fill } from 'react-icons/ri';
import { AiTwotoneDelete } from 'react-icons/ai';
import StyledButton from '../../StyledButton/StyledButton';
import { useState } from 'react';
import StyledModal from '../../StyledModal/StyledModal';
import { useDeleteComment } from '../../../hooks/useDeleteComment';

interface Props {
  firstlevelCommentId: number;
  commentId: number;
  handleEdit: () => void;
  isEditing: boolean;
  handleCancelEdit: () => void;
  handleAcceptEdit: () => void;
  handleReply: () => void;
}

export default function CommentActionButtons(props: Props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteComment = useDeleteComment()

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  }

  const handleConfirmDelete = () => {
    deleteComment.mutate({
      deletedCommentId: props.commentId,
      firstlevelCommentId: props.firstlevelCommentId
    })
    setShowDeleteModal(false);
  }

  const handleClickDeleteComment = () => {
    setShowDeleteModal(true)
  }

  return (
    <div className={styles.actionButtons}>
      {props.isEditing ? (
        <div className={styles.editButtons}>
          <StyledButton label={'Accept'} onClick={props.handleAcceptEdit} />
          <StyledButton
            label={'Cancel'}
            isCancelButton={true}
            onClick={props.handleCancelEdit}
          />
        </div>
      ) : (
        <>
          <button
            onClick={handleClickDeleteComment}
            className={styles.deleteButton + ' ' + styles.whiteBackground}
          >
            <AiTwotoneDelete />
            Delete
          </button>
          <button
            className={styles.replyEditButton + ' ' + styles.whiteBackground}
            onClick={props.handleEdit}
          >
            <RiEdit2Fill />
            Edit
          </button>
          <button
            className={styles.replyEditButton + ' ' + styles.whiteBackground}
            onClick={props.handleReply}
          >
            <FaReply />
            Reply
          </button>
        </>
      )}
      <StyledModal isOpen={showDeleteModal} onConfirm={handleConfirmDelete} onCancel={handleCancelDelete} />
    </div>
  );
}
