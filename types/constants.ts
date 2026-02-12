import { z } from "zod";
export const COMP_NAME = "MyComp";

export const VIDEO_FPS = 30;
export const QUESTION_DURATION_SECONDS = 8;
export const QUIZ_QUESTION_COUNT = 10;
export const DURATION_IN_FRAMES =
  QUIZ_QUESTION_COUNT * QUESTION_DURATION_SECONDS * VIDEO_FPS;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;

const QuizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
});

export const CompositionProps = z.object({
  title: z.string(),
  questions: z.array(QuizQuestionSchema).length(QUIZ_QUESTION_COUNT),
});

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

export const DEFAULT_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "Qual e a capital da Australia?",
    options: ["Sydney", "Canberra", "Melbourne", "Perth"],
  },
  {
    question: "Qual planeta e chamado de planeta vermelho?",
    options: ["Venus", "Marte", "Jupiter", "Mercurio"],
  },
  {
    question: "Qual e o maior oceano da Terra?",
    options: ["Atlantico", "Indico", "Pacifico", "Artico"],
  },
  {
    question: "Qual pais tem mais fuso horario no mundo?",
    options: ["Russia", "China", "Franca", "Estados Unidos"],
  },
  {
    question: "Qual e o rio mais extenso do mundo?",
    options: ["Nilo", "Amazonas", "Yangtze", "Mississippi"],
  },
  {
    question: "Em qual continente fica o deserto do Saara?",
    options: ["Asia", "Africa", "America do Sul", "Oceania"],
  },
  {
    question: "Qual e a montanha mais alta do planeta?",
    options: ["K2", "Everest", "Aconcagua", "Kilimanjaro"],
  },
  {
    question: "Qual e o menor pais do mundo?",
    options: ["Monaco", "San Marino", "Vaticano", "Liechtenstein"],
  },
  {
    question: "Qual linha divide os hemisferios norte e sul?",
    options: [
      "Tropico de Cancer",
      "Meridiano de Greenwich",
      "Equador",
      "Tropico de Capricornio",
    ],
  },
  {
    question: "Qual e a maior floresta tropical do mundo?",
    options: ["Congo", "Taiga", "Amazonia", "Bornio"],
  },
];

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  title: "Geography",
  questions: DEFAULT_QUIZ_QUESTIONS,
};
