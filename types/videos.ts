import type { GenerateQuizOutput } from "./quizzes";

export enum VideoStatusEnum {
  DRAFT = "DRAFT",
  RENDERED = "RENDERED",
  PUBLISHED = "PUBLISHED",
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
  templateId?: "comic-pop" | "neon-pulse" | "sunset-wave";
  video: {
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
    key?: string;
  };
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
