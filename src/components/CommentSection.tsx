import FirstLevelComment from './Comment/FirstLevelComment';
import WritingBox from './WritingBox/WritingBox';
import {
  useAddComment,
  useComments,
} from '../service/commentService';
import styles from './comment-section.module.css';

export default function ComentSection() {
  let { comments, isLoading } = useComments();
  let addComment = useAddComment();

  const handleSendComment = (newComment: string) => {
    if (newComment) {
      addComment.mutate({ content: newComment });
    }
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
        />
      ))}
      <WritingBox handleSend={handleSendComment} />
    </div>
  );
}
