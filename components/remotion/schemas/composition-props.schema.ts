import { z } from "zod";
import { QuizTemplateEnum } from "../enums";

export const QuizQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string(),
  options: z.array(z.object({
    id: z.string().min(1),
    text: z.string().min(1),
  })).length(4),
  answer: z.object({
    correctAnswerIndex: z.number().int().min(0).max(3),
  }),
  questionPath: z.string(),
  answerCorrectPath: z.string(),
});

export const CompositionProps = z.object({
  title: z.string(),
  templateId: z.nativeEnum(QuizTemplateEnum),
  questions: z
    .array(QuizQuestionSchema)
    .min(4)
    .max(10),
});

// export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
// export type CompositionInputProps = z.infer<typeof CompositionProps>;

export type QuizOption = {
  id: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
  answer: {
    correctAnswerIndex: number;
  };
  questionPath: string;
  answerCorrectPath: string;
};

export type CompositionInputProps = {
  title: string;
  templateId?: QuizTemplateEnum;
  questions: QuizQuestion[];
};
