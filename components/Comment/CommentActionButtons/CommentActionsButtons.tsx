import styles from './comment-actions-buttons.module.css';
import { FaReply } from 'react-icons/fa';
import { RiEdit2Fill } from 'react-icons/ri';
import { AiTwotoneDelete } from 'react-icons/ai';
import React = require('react');
import StyledButton from '../../Comment/StyledButton/StyledButton';

interface Props {
  handleEdit: () => void;
  isEditing: boolean;
  handleCancelEdit: () => void;
  handleAcceptEdit: () => void;
  handleReply: () => void;
}

export default function CommentActionButtons(props: Props) {
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
        <React.Fragment>
          <button
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
        </React.Fragment>
      )}
    </div>
  );
}
