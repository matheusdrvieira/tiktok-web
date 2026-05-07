export type TikTokPrivacyLevel =
  | "PUBLIC_TO_EVERYONE"
  | "MUTUAL_FOLLOW_FRIENDS"
  | "SELF_ONLY"
  | "FOLLOWER_OF_CREATOR";

export type TikTokCreatorInfoOutput = {
  creatorAvatarUrl: string;
  creatorUsername: string;
  creatorNickname: string;
  privacyLevelOptions: TikTokPrivacyLevel[];
  commentDisabled: boolean;
  duetDisabled: boolean;
  stitchDisabled: boolean;
  maxVideoPostDurationSec: number;
  canPost: boolean;
  canPostErrorCode: string | null;
  canPostErrorMessage: string | null;
};

export type PublishVideoInput = {
  videoId?: string;
  title: string;
  videoPath: string;
  privacyLevel: TikTokPrivacyLevel;
  disableComment: boolean;
  disableDuet: boolean;
  disableStitch: boolean;
  brandContentToggle: boolean;
  brandOrganicToggle: boolean;
};

export type PublishVideoOutput = {
  publishId?: string;
};

export type TikTokPublishStatusOutput = {
  publishId: string;
  status: string;
  failReason: string | null;
  publiclyAvailablePostIds: string[];
  uploadedBytes: number | null;
  downloadedBytes: number | null;
};
