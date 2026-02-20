export type OutVideoOption = {
  id?: string;
  name: string;
  path: string;
  url?: string;
  createdAt?: string;
};

export type OutVideosResponse = {
  videos?: OutVideoOption[];
};

export type PreRenderRequestPayload = {
  title: string;
  questions: Array<{
    id: string;
    question: string;
    options: Array<{
      id: string;
      text: string;
    }>;
    answer: {
      correctOptionId: string;
    };
    questionPath: string;
    answerCorrectPath: string;
  }>;
};

export type PreRenderJobStatus =
  | "queued"
  | "rendering"
  | "uploading"
  | "done"
  | "error";

export type PreRenderStartApiResponse = {
  jobId: string;
};

export type PreRenderJobApiResponse = {
  id: string;
  status: PreRenderJobStatus;
  progress: number;
  message?: string;
  video?: OutVideoOption;
};

export type UserRenderedVideo = {
  id: string;
  userId: string;
  name: string;
  url: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PublishVideoInput = {
  title: string;
  videoPath: string;
};

export type PublishVideoResponse = {
  publishId?: string;
};

export type GeneratedQuizVideoOption = {
  id: string;
  text: string;
};

export type GeneratedQuizVideoQuestion = {
  id: string;
  question: string;
  options: GeneratedQuizVideoOption[];
  answer: {
    correctOptionId: string;
  };
  questionPath: string;
  answerCorrectPath: string;
};

export type GeneratedQuizVideoResponse = {
  title: string;
  questions: GeneratedQuizVideoQuestion[];
};

export type TikTokCreatorInfoResponse = {
  creatorAvatarUrl: string;
  creatorUsername: string;
  creatorNickname: string;
  privacyLevelOptions: Array<
    "PUBLIC_TO_EVERYONE" | "MUTUAL_FOLLOW_FRIENDS" | "SELF_ONLY" | "FOLLOWER_OF_CREATOR"
  >;
  commentDisabled: boolean;
  duetDisabled: boolean;
  stitchDisabled: boolean;
  maxVideoPostDurationSec: number;
};

export type CreatorInfoResponse = TikTokCreatorInfoResponse | null;
