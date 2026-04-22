import type { GenerateQuizOutput } from "./quizzes";

export enum VideoStatusEnum {
  DRAFT = "DRAFT",
  RENDERED = "RENDERED",
  PUBLISHED = "PUBLISHED",
}

export enum RenderJobStatusEnum {
  QUEUED = "QUEUED",
  RUNNING = "RUNNING",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
}

export type VideoOutput = {
  id?: string;
  title: string;
  hashtags: string[];
  description: string;
  category: string;
  quizId: string;
  url?: string;
  size?: number;
  duration?: number;
  status: VideoStatusEnum;
  createdAt?: string;
};

export type RenderVideoInput = {
  videoId: string;
  templateId?: "comic-pop" | "neon-pulse" | "sunset-wave";
  questions: GenerateQuizOutput["questions"];
};

export type RenderVideoOutput = {
  message: string;
  job: RenderJobOutput;
};

export type RenderJobOutput = {
  id: string;
  userId: string;
  videoId: string;
  templateId?: "comic-pop" | "neon-pulse" | "sunset-wave";
  status: RenderJobStatusEnum;
  error?: string;
  resultKey?: string;
  resultUrl?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type RenderJobStatusOutput = {
  job: RenderJobOutput;
};

export type UpdateVideoInput = {
  videoId: string;
  title: string;
  hashtags: string[];
  description: string;
  category: string;
  quizId: string;
};

export type UpdateVideoOutput = {
  id: string;
  userId: string;
  title: string;
  hashtags: string[];
  description: string;
  category: string;
  quizId: string;
  url: string;
  size?: number;
  duration?: number;
  status: VideoStatusEnum;
  createdAt?: string;
  updatedAt?: string;
};
