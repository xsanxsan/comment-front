import React = require('react');
import StyledButton from '../Comment/StyledButton/StyledButton';
import ProfileBubble from '../ProfileBubble/ProfileBubble';
import TextArea from '../WritingBox/TextAreaComponent/TextArea';
import styles from './writing-box.module.css';

interface Props {
  handleSend: (newComment: string) => void;
  handleCancel?: () => void;
  closable?: boolean;
}

export default function WritingBox(props: Props) {
  const [writtenComment, setWrittenComment] = React.useState('');

  const handleSendComment = () => {
    setWrittenComment('');
    props.handleSend(writtenComment);
  };

  const handleCancel = () => {
    setWrittenComment('');
    props.handleCancel();
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
