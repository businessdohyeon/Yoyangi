export type CommunityUser = {
  id: number;
  name: string;
};

export type CommunityCommentReply = {
  commentId: number;
  userName?: string;
  userId?: number;
  createdAt?: string;
  content?: string;
};

export type CommunityComment = {
  commentId: number;
  userName?: string;
  userId?: number;
  createdAt?: string;
  content?: string;
  replies?: CommunityCommentReply[];
};

export type CommunityDetail = {
  id: number;
  title: string;
  content?: string;
  images?: string[];
  user?: CommunityUser;
  comments?: CommunityComment[];
  createdAt?: string;
};

// Wrapper matching the server sample: { Message, ResultCode, Community }
export type CommunityApiResponse = {
  Message?: string;
  ResultCode?: string;
  Community?: CommunityDetail;
};

export default {} as const;
