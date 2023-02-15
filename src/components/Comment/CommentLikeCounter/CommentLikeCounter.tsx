import { BiMinus, BiPlus } from 'react-icons/bi';
import { UpVoteDownVote } from '../../../models/CommentModel';
import { useVoteComment } from '../../../service/commentService';
import styles from './comment-counter.module.css';

interface Props {
  score: number;
  firstLevelCommentId: number;
  commentId: number;
}

export default function CommentLikeCounter(props: Props) {
  let voteComment = useVoteComment();

  const handleLikeCounter = (vote: UpVoteDownVote) => {
    return () => {
      voteComment.mutate({
        vote,
        firstlevelCommentId: props.firstLevelCommentId,
        votedCommentId: props.commentId,
      });
    };
  };

  return (
    <div className={styles.counter}>
      <button onClick={handleLikeCounter(UpVoteDownVote.downvote)}>
        <BiMinus />
      </button>
      <span>{props.score}</span>
      <button onClick={handleLikeCounter(UpVoteDownVote.upvote)}>
        <BiPlus />
      </button>
    </div>
  );
}
