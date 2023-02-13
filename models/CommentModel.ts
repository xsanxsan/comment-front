export enum CommentStatus {
  SENDING = 'SENDING',
  ERROR = 'ERROR',
  SENT = 'SENT',
}

export interface CommentModel {
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
}

export interface CommentReplyModel extends CommentModel {
  replyingTo: string;
}

export interface FirstLevelCommentModel extends CommentModel {
  replies: CommentReplyModel[];
}

export enum UpVoteDownVote {
  upvote = 1,
  downvote = -1,
}
