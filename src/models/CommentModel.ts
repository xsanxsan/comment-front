export enum CommentStatus {
  SENDING = 'SENDING',
  ERROR = 'ERROR',
  SENT = 'SENT',
}

export type CommentReplyModel = {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: {
    image: {
      png: string;
      webp: string;
    };
    username: string;
  };
  isEdited: boolean;
  replyingTo: string;
}

export type FirstLevelCommentModel = {
  id: number;
  content: string;
  createdAt: string;
  score: number;
  user: {
    image: {
      png: string;
      webp: string;
    };
    username: string;
  };
  isEdited: boolean;
  replies: CommentReplyModel[];
}

export enum UpVoteDownVote {
  upvote = 1,
  downvote = -1,
}
