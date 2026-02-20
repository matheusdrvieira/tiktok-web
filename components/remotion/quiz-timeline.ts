import { parseMedia } from "@remotion/media-parser";
import { INTRO_DURATION_SECONDS, type QuizQuestion } from "./constants";

export const COUNTDOWN_SECONDS = 8;
export const BGM_SRC = "/quiz-loop.mp3";
export const COUNTDOWN_MUSIC_SRC = "/clock.mp3";
export const ANSWER_CORRECT_SFX_SRC = "/answer_correct.wav";

const FALLBACK_AUDIO_DURATION_SECONDS = 4;
const NARRATION_TAIL_PADDING_SECONDS = 0.2;
const FINAL_ANSWER_EXTRA_PADDING_SECONDS = 1;

const audioDurationCache = new Map<string, Promise<number>>();

type TimelineBaseScene = {
  from: number;
  durationInFrames: number;
};

export type IntroScene = TimelineBaseScene & {
  type: "intro";
};

export type QuestionScene = TimelineBaseScene & {
  type: "question";
  questionIndex: number;
  audioSrc: string;
};

export type CountdownScene = TimelineBaseScene & {
  type: "countdown";
  questionIndex: number;
};

export type AnswerScene = TimelineBaseScene & {
  type: "answer";
  questionIndex: number;
  audioSrc: string;
};

export type QuizScene = IntroScene | QuestionScene | CountdownScene | AnswerScene;

export type QuizTimeline = {
  scenes: QuizScene[];
  totalDurationInFrames: number;
};

const toFrames = (seconds: number, fps: number): number => {
  const safeSeconds = Number.isFinite(seconds) && seconds > 0
    ? seconds
    : FALLBACK_AUDIO_DURATION_SECONDS;

  return Math.max(1, Math.ceil(safeSeconds * fps));
};

const getDurationInSecondsForAudio = async (src: string): Promise<number> => {
  try {
    const { durationInSeconds } = await parseMedia({
      src,
      fields: { durationInSeconds: true },
      acknowledgeRemotionLicense: true,
    });

    if (typeof durationInSeconds === "number" && Number.isFinite(durationInSeconds) && durationInSeconds > 0) {
      return durationInSeconds;
    }

    return FALLBACK_AUDIO_DURATION_SECONDS;
  } catch {
    return FALLBACK_AUDIO_DURATION_SECONDS;
  }
};

const getDurationInFramesForAudio = async (
  src: string,
  fps: number,
): Promise<number> => {
  let durationPromise = audioDurationCache.get(src);

  if (!durationPromise) {
    durationPromise = getDurationInSecondsForAudio(src);
    audioDurationCache.set(src, durationPromise);
  }

  const seconds = await durationPromise;
  return toFrames(seconds, fps);
};

export const buildQuizTimeline = async (
  questions: QuizQuestion[],
  fps: number,
): Promise<QuizTimeline> => {
  audioDurationCache.clear();

  const introDurationInFrames = toFrames(INTRO_DURATION_SECONDS, fps);
  const countdownDurationInFrames = toFrames(COUNTDOWN_SECONDS, fps);
  const narrationTailPaddingInFrames = toFrames(NARRATION_TAIL_PADDING_SECONDS, fps);
  const finalAnswerExtraPaddingInFrames = toFrames(FINAL_ANSWER_EXTRA_PADDING_SECONDS, fps);

  const scenes: QuizScene[] = [];
  let cursor = 0;

  const pushScene = (scene: QuizScene) => {
    scenes.push(scene);
    cursor += scene.durationInFrames;
  };

  pushScene({
    type: "intro",
    from: cursor,
    durationInFrames: introDurationInFrames,
  });

  for (const [index, question] of questions.entries()) {
    const questionNarrationSrc = question.questionPath;
    const answerNarrationSrc = question.answerCorrectPath;

    const [questionAudioFrames, answerAudioFrames] = await Promise.all([
      getDurationInFramesForAudio(questionNarrationSrc, fps),
      getDurationInFramesForAudio(answerNarrationSrc, fps),
    ]);

    const questionDurationInFrames = questionAudioFrames + narrationTailPaddingInFrames;
    const isLastQuestion = index === questions.length - 1;
    const answerDurationInFrames =
      answerAudioFrames +
      narrationTailPaddingInFrames +
      (isLastQuestion ? finalAnswerExtraPaddingInFrames : 0);

    pushScene({
      type: "question",
      questionIndex: index,
      from: cursor,
      durationInFrames: questionDurationInFrames,
      audioSrc: questionNarrationSrc,
    });

    pushScene({
      type: "countdown",
      questionIndex: index,
      from: cursor,
      durationInFrames: countdownDurationInFrames,
    });

    pushScene({
      type: "answer",
      questionIndex: index,
      from: cursor,
      durationInFrames: answerDurationInFrames,
      audioSrc: answerNarrationSrc,
    });
  }

  return {
    scenes,
    totalDurationInFrames: cursor,
  };
};
