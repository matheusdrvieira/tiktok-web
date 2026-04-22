import { parseMedia } from "@remotion/media-parser";
import { staticFile } from "remotion";
import {
  COUNTDOWN_SECONDS,
  FINAL_ANSWER_EXTRA_PADDING_SECONDS,
  NARRATION_TAIL_PADDING_SECONDS,
} from "./constants";
import type { QuizQuestion } from "./schemas/composition-props.schema";
import type { QuizScene, QuizTimeline } from "./types";

const toFrames = (seconds: number, fps: number): number => {
  return Math.ceil(seconds * fps);
};

const STATIC_AUDIO_DURATIONS_IN_SECONDS: Record<string, number> = {
  "answer_correct.wav": 1.8800680272108843,
  "clock.mp3": 8.064,
  "quiz-loop.mp3": 125.23102040816326,
};

const getStaticAudioDurationInSeconds = (src: string): number | null => {
  const pathname = getAudioPathname(src);
  if (!pathname) {
    return null;
  }

  const normalizedSrc = pathname.replace(/^\/+/, "").replace(/^public\//, "");
  const filename = normalizedSrc.split("/").pop();
  return STATIC_AUDIO_DURATIONS_IN_SECONDS[normalizedSrc] ??
    (filename ? STATIC_AUDIO_DURATIONS_IN_SECONDS[filename] : null) ??
    null;
};

const getAudioPathname = (src: string): string | null => {
  try {
    return new URL(src).pathname;
  } catch {
    return src.split("?")[0]?.split("#")[0] ?? null;
  }
};

const resolveAudioSrc = (src: string): string => {
  return src.startsWith("/")
    ? staticFile(src.replace(/^\/+/, "").replace(/^public\//, ""))
    : src;
};

const parseAudioDurationInSeconds = async (src: string): Promise<number> => {
  const { durationInSeconds } = await parseMedia({
    src,
    fields: { durationInSeconds: true },
    acknowledgeRemotionLicense: true,
  });

  return durationInSeconds as number;
};

const parseAudioDurationFromBufferedFetch = async (
  src: string,
): Promise<number | null> => {
  if (
    typeof fetch !== "function" ||
    typeof Blob === "undefined" ||
    typeof URL.createObjectURL !== "function"
  ) {
    return null;
  }

  try {
    const response = await fetch(src, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }

    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    try {
      return await parseAudioDurationInSeconds(objectUrl);
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  } catch {
    return null;
  }
};

const getDurationInSecondsForAudio = async (
  src: string,
  fallbackDurationInSeconds: number,
): Promise<number> => {
  const staticDurationInSeconds = getStaticAudioDurationInSeconds(src);
  if (staticDurationInSeconds !== null) {
    return staticDurationInSeconds;
  }

  const audioSrc = resolveAudioSrc(src);

  try {
    return await parseAudioDurationInSeconds(audioSrc);
  } catch {
    const bufferedDurationInSeconds =
      await parseAudioDurationFromBufferedFetch(audioSrc);

    return bufferedDurationInSeconds ?? fallbackDurationInSeconds;
  }
};

const estimateNarrationDurationInSeconds = (text: string): number => {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.min(14, Math.max(3, words / 2.4 + 1.2));
};

const getAnswerText = (question: QuizQuestion): string => {
  const index = question.answer.correctAnswerIndex;
  return question.options[index]?.text ?? "";
};

const getDurationInFramesForAudio = async (
  src: string,
  fps: number,
  fallbackDurationInSeconds: number,
): Promise<number> => {
  const seconds = await getDurationInSecondsForAudio(
    src,
    fallbackDurationInSeconds,
  );
  return toFrames(seconds, fps);
};

export const buildQuizTimeline = async (
  questions: QuizQuestion[],
  fps: number,
): Promise<QuizTimeline> => {
  const countdownDurationInFrames = toFrames(COUNTDOWN_SECONDS, fps);
  const narrationTailPaddingInFrames = toFrames(NARRATION_TAIL_PADDING_SECONDS, fps);
  const finalAnswerExtraPaddingInFrames = toFrames(FINAL_ANSWER_EXTRA_PADDING_SECONDS, fps);

  const scenes: QuizScene[] = [];
  let cursor = 0;

  const pushScene = (scene: QuizScene) => {
    scenes.push(scene);
    cursor += scene.durationInFrames;
  };

  for (const [index, question] of questions.entries()) {
    const questionNarrationSrc = question.questionPath;
    const answerNarrationSrc = question.answerCorrectPath;

    const [questionAudioFrames, answerAudioFrames] = await Promise.all([
      getDurationInFramesForAudio(
        questionNarrationSrc,
        fps,
        estimateNarrationDurationInSeconds(question.question),
      ),
      getDurationInFramesForAudio(
        answerNarrationSrc,
        fps,
        estimateNarrationDurationInSeconds(getAnswerText(question)),
      ),
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
