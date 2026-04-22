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

const getDurationInSecondsForAudio = async (src: string): Promise<number> => {
  const audioSrc = src.startsWith("/")
    ? staticFile(src.replace(/^\/+/, ""))
    : src;

  const { durationInSeconds } = await parseMedia({
    src: audioSrc,
    fields: { durationInSeconds: true },
    acknowledgeRemotionLicense: true,
  });

  return durationInSeconds as number;
};

const getDurationInFramesForAudio = async (src: string, fps: number): Promise<number> => {
  const seconds = await getDurationInSecondsForAudio(src);
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
