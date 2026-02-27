import { z } from "zod";

const hashtagPattern = /^#[^\s#]+$/;

export const publicationFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Informe um titulo."),
  hashtags: z
    .string()
    .trim()
    .min(1, "Informe ao menos uma hashtag.")
    .refine((value: string) => value.split(/\s+/).every((tag: string) => hashtagPattern.test(tag)), {
      message: "Use hashtags no formato #tag separadas por espaco.",
    }),
  category: z
    .string()
    .trim()
    .min(1, "Informe uma categoria."),
  description: z
    .string()
    .trim()
    .min(1, "Informe uma descricao.")
    .max(500, "Descricao deve ter no maximo 500 caracteres."),
});

export type PublicationFormValues = z.infer<typeof publicationFormSchema>;
