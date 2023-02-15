import { useState } from 'react';
import StyledButton from '../StyledButton/StyledButton';
import ProfileBubble from '../ProfileBubble/ProfileBubble';
import TextArea from '../WritingBox/TextAreaComponent/TextArea';
import styles from './writing-box.module.css';

interface Props {
  handleSend: (newComment: string) => void;
  handleCancel?: () => void;
  closable?: boolean;
}

export default function WritingBox(props: Props) {
  const [writtenComment, setWrittenComment] = useState('');

  const handleSendComment = () => {
    setWrittenComment('');
    props.handleSend(writtenComment);
  };

  const handleCancel = () => {
    setWrittenComment('');
    props.handleCancel && props.handleCancel();
  };

  return (
    <div className={styles.writingBox}>
      <TextArea onChange={setWrittenComment} initialText={writtenComment} />
      <ProfileBubble />
      <StyledButton label={'Send'} onClick={handleSendComment} />
      {props.closable && (
        <StyledButton
          label={'Cancel'}
          onClick={handleCancel}
          isCancelButton={true}
        />
      )}
    </div>
  );
}
