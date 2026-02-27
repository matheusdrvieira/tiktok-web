"use client";

import type {
  GenerateQuizInput,
  GenerateQuizOutput,
  QuizOutput,
} from "@/types/quizzes";
import { api } from "@/utils/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useQuizzesService = () => {
  const generateQuiz = useMutation({
    mutationFn: async (
      payload: GenerateQuizInput,
    ): Promise<GenerateQuizOutput> => {
      const { data } = await api.post(
        "/ai/quiz/video",
        payload,
        {
          timeout: 0,
        },
      );

      return data;
    },
  });

  const getQuizzes = useQuery({
    queryKey: ["quizzes"],
    queryFn: async (): Promise<QuizOutput[]> => {
      const { data } = await api.get("/quizzes");
      return data;
    },
  });

  const getLatestQuiz = useQuery({
    queryKey: ["quizzes", "latest"],
    queryFn: async (): Promise<QuizOutput | null> => {
      const { data } = await api.get("/quizzes");
      return data[0] ?? null;
    },
  });

  return {
    generateQuiz,
    getQuizzes,
    getLatestQuiz,
  };
};
