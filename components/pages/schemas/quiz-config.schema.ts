import { z } from "zod";

export const quizConfigFormSchema = z.object({
  niche: z
    .string()
    .trim()
    .min(1, "Informe o nicho."),
  reference: z.string().trim(),
  questionsCount: z
    .number()
    .int("Use um numero inteiro.")
    .min(4, "Minimo de 4 perguntas.")
    .max(10, "Maximo de 10 perguntas."),
});

export type QuizConfigFormValues = z.infer<typeof quizConfigFormSchema>;
