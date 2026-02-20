import { z } from "zod";

export const COMP_NAME = "MyComp";

export const VIDEO_FPS = 30;
export const INTRO_DURATION_SECONDS = 1.8;
export const ANSWER_DURATION_SECONDS = 8;
export const ANSWER_REVEAL_SECONDS = 2;
export const QUESTION_DURATION_SECONDS =
  ANSWER_DURATION_SECONDS + ANSWER_REVEAL_SECONDS;
export const QUIZ_QUESTION_COUNT = 10;
export const DURATION_IN_FRAMES =
  Math.round(INTRO_DURATION_SECONDS * VIDEO_FPS) +
  QUIZ_QUESTION_COUNT * QUESTION_DURATION_SECONDS * VIDEO_FPS;
export const VIDEO_WIDTH = 1080;
export const VIDEO_HEIGHT = 1920;

const QuizOptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
});

const QuizQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string(),
  options: z.array(QuizOptionSchema).length(4),
  answer: z.object({
    correctOptionId: z.string().min(1),
  }),
  questionPath: z.string(),
  answerCorrectPath: z.string(),
});

export const CompositionProps = z.object({
  title: z.string(),
  questions: z.array(QuizQuestionSchema).length(QUIZ_QUESTION_COUNT),
});

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type CompositionInputProps = z.infer<typeof CompositionProps>;

export const DEFAULT_QUIZ_TITLE = "Geography\n#geography #quiz #foryou";

export const DEFAULT_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "Qual e a capital da Australia?",
    options: [
      { id: "q1o1", text: "Sydney" },
      { id: "q1o2", text: "Canberra" },
      { id: "q1o3", text: "Melbourne" },
      { id: "q1o4", text: "Perth" },
    ],
    answer: { correctOptionId: "q1o2" },
    questionPath: "/tts/1_question.wav",
    answerCorrectPath: "/tts/1_question_correct.wav",
  },
  {
    id: "q2",
    question: "Qual planeta e chamado de planeta vermelho?",
    options: [
      { id: "q2o1", text: "Venus" },
      { id: "q2o2", text: "Marte" },
      { id: "q2o3", text: "Jupiter" },
      { id: "q2o4", text: "Mercurio" },
    ],
    answer: { correctOptionId: "q2o2" },
    questionPath: "/tts/2_question.wav",
    answerCorrectPath: "/tts/2_question_correct.wav",
  },
  {
    id: "q3",
    question: "Qual e o maior oceano da Terra?",
    options: [
      { id: "q3o1", text: "Atlantico" },
      { id: "q3o2", text: "Indico" },
      { id: "q3o3", text: "Pacifico" },
      { id: "q3o4", text: "Artico" },
    ],
    answer: { correctOptionId: "q3o3" },
    questionPath: "/tts/3_question.wav",
    answerCorrectPath: "/tts/3_question_correct.wav",
  },
  {
    id: "q4",
    question: "Qual pais tem mais fuso horario no mundo?",
    options: [
      { id: "q4o1", text: "Russia" },
      { id: "q4o2", text: "China" },
      { id: "q4o3", text: "Franca" },
      { id: "q4o4", text: "Estados Unidos" },
    ],
    answer: { correctOptionId: "q4o3" },
    questionPath: "/tts/4_question.wav",
    answerCorrectPath: "/tts/4_question_correct.wav",
  },
  {
    id: "q5",
    question: "Qual e o rio mais extenso do mundo?",
    options: [
      { id: "q5o1", text: "Nilo" },
      { id: "q5o2", text: "Amazonas" },
      { id: "q5o3", text: "Yangtze" },
      { id: "q5o4", text: "Mississippi" },
    ],
    answer: { correctOptionId: "q5o2" },
    questionPath: "/tts/5_question.wav",
    answerCorrectPath: "/tts/5_question_correct.wav",
  },
  {
    id: "q6",
    question: "Em qual continente fica o deserto do Saara?",
    options: [
      { id: "q6o1", text: "Asia" },
      { id: "q6o2", text: "Africa" },
      { id: "q6o3", text: "America do Sul" },
      { id: "q6o4", text: "Oceania" },
    ],
    answer: { correctOptionId: "q6o2" },
    questionPath: "/tts/6_question.wav",
    answerCorrectPath: "/tts/6_question_correct.wav",
  },
  {
    id: "q7",
    question: "Qual e a montanha mais alta do planeta?",
    options: [
      { id: "q7o1", text: "K2" },
      { id: "q7o2", text: "Everest" },
      { id: "q7o3", text: "Aconcagua" },
      { id: "q7o4", text: "Kilimanjaro" },
    ],
    answer: { correctOptionId: "q7o2" },
    questionPath: "/tts/7_question.wav",
    answerCorrectPath: "/tts/7_question_correct.wav",
  },
  {
    id: "q8",
    question: "Qual e o menor pais do mundo?",
    options: [
      { id: "q8o1", text: "Monaco" },
      { id: "q8o2", text: "San Marino" },
      { id: "q8o3", text: "Vaticano" },
      { id: "q8o4", text: "Liechtenstein" },
    ],
    answer: { correctOptionId: "q8o3" },
    questionPath: "/tts/8_question.wav",
    answerCorrectPath: "/tts/8_question_correct.wav",
  },
  {
    id: "q9",
    question: "Qual linha divide os hemisferios norte e sul?",
    options: [
      { id: "q9o1", text: "Tropico de Cancer" },
      { id: "q9o2", text: "Meridiano de Greenwich" },
      { id: "q9o3", text: "Equador" },
      { id: "q9o4", text: "Tropico de Capricornio" },
    ],
    answer: { correctOptionId: "q9o3" },
    questionPath: "/tts/9_question.wav",
    answerCorrectPath: "/tts/9_question_correct.wav",
  },
  {
    id: "q10",
    question: "Qual e a maior floresta tropical do mundo?",
    options: [
      { id: "q10o1", text: "Congo" },
      { id: "q10o2", text: "Taiga" },
      { id: "q10o3", text: "Amazonia" },
      { id: "q10o4", text: "Bornio" },
    ],
    answer: { correctOptionId: "q10o3" },
    questionPath: "/tts/10_question.wav",
    answerCorrectPath: "/tts/10_question_correct.wav",
  },
].map((question) => ({
  ...question,
  questionPath: `${process.env.NEXT_PUBLIC_FRONTEND_URL}${question.questionPath}`,
  answerCorrectPath: `${process.env.NEXT_PUBLIC_FRONTEND_URL}${question.answerCorrectPath}`
}));

export const DEFAULT_QUIZ_CONTENT: CompositionInputProps = {
  title: DEFAULT_QUIZ_TITLE,
  questions: DEFAULT_QUIZ_QUESTIONS,
};
