import type { VideoOutput } from "./videos";

type GenerateQuizOptionOutput = {
  id: string;
  text: string;
};

type GenerateQuizQuestionOutput = {
  id: string;
  question: string;
  options: GenerateQuizOptionOutput[];
  answer: {
    correctAnswerIndex: number;
  };
  questionPath: string;
  answerCorrectPath: string;
};

export type GenerateQuizInput = {
  niche: string;
  reference: string;
  questionsCount: number;
};

export type GenerateQuizOutput = {
  title: string;
  hashtags: string;
  category: string;
  description: string;
  quizId?: string;
  videoId?: string;
  questions: GenerateQuizQuestionOutput[];
};

type QuizOptionOutput = {
  id: string;
  text: string;
  createdAt?: string;
  updatedAt?: string;
};

type QuizQuestionOutput = {
  id: string;
  question: string;
  correctAnswerIndex: number;
  questionPath?: string;
  answerCorrectPath?: string;
  options: QuizOptionOutput[];
  createdAt?: string;
  updatedAt?: string;
};

export type QuizOutput = {
  id: string;
  userId: string;
  videos: VideoOutput[];
  questions: QuizQuestionOutput[];
  createdAt?: string;
  updatedAt?: string;
};
