export type TikTokCreatorInfoOutput = {
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

export type PublishVideoInput = {
  videoId?: string;
  title: string;
  videoPath: string;
};

export type PublishVideoOutput = {
  publishId?: string;
};
