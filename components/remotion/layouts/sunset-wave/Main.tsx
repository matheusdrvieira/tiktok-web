import { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Html5Audio,
  Sequence,
  continueRender,
  delayRender,
  staticFile,
  useVideoConfig,
} from "remotion";
import type { CompositionInputProps } from "../../schemas/composition-props.schema";
import {
  ANSWER_CORRECT_SFX_SRC,
  BGM_SRC,
  COUNTDOWN_MUSIC_SRC,
} from "../../constants";
import { buildQuizTimeline } from "../../quiz-timeline";
import type {
  AnswerScene,
  CountdownScene,
  QuestionScene,
  QuizTimeline,
} from "../../types";
import { AnswerContent } from "./AnswerContent";
import { Background } from "./Background";
import { CountdownContent } from "./CountdownContent";
import { Header } from "./Header";
import { QuestionContent } from "./QuestionContent";

const resolveAudioSrc = (src: string): string =>
  src.startsWith("/") ? staticFile(src.replace(/^\/+/, "")) : src;

const getAnswerOptions = (
  question: CompositionInputProps["questions"][number],
): string[] => question.options.map((option: { text: string }) => option.text);

const getCorrectAnswerIndex = (
  question: CompositionInputProps["questions"][number],
): number => {
  const index = question.answer.correctAnswerIndex;
  return Number.isInteger(index) && index >= 0 && index < question.options.length ? index : 0;
};

const questionLayoutStyle = {
  display: "flex",
  flexDirection: "column" as const,
  paddingTop: 126,
  paddingLeft: 66,
  paddingRight: 66,
  paddingBottom: 108,
};

const QuestionSequence = ({
  questionCount,
  scene,
  question,
}: {
  questionCount: number;
  scene: QuestionScene;
  question: CompositionInputProps["questions"][number];
}) => {
  return (
    <Sequence
      key={`${scene.type}-${scene.questionIndex}-${scene.from}`}
      from={scene.from}
      durationInFrames={scene.durationInFrames}
    >
      <AbsoluteFill style={questionLayoutStyle}>
        <Header scene={scene} totalQuestions={questionCount} />
        <div style={{ marginTop: 38 }}>
          <QuestionContent question={question.question} />
        </div>
      </AbsoluteFill>
      <Html5Audio src={resolveAudioSrc(scene.audioSrc)} />
    </Sequence>
  );
};

const CountdownSequence = ({
  questionCount,
  scene,
  question,
}: {
  questionCount: number;
  scene: CountdownScene;
  question: CompositionInputProps["questions"][number];
}) => {
  return (
    <Sequence
      key={`${scene.type}-${scene.questionIndex}-${scene.from}`}
      from={scene.from}
      durationInFrames={scene.durationInFrames}
    >
      <AbsoluteFill style={questionLayoutStyle}>
        <Header scene={scene} totalQuestions={questionCount} />
        <div style={{ marginTop: 38 }}>
          <CountdownContent
            question={question.question}
            answers={getAnswerOptions(question)}
          />
        </div>
      </AbsoluteFill>
      <Html5Audio
        src={resolveAudioSrc(COUNTDOWN_MUSIC_SRC)}
        trimAfter={scene.durationInFrames}
        volume={0.2}
      />
    </Sequence>
  );
};

const AnswerSequence = ({
  questionCount,
  scene,
  question,
}: {
  questionCount: number;
  scene: AnswerScene;
  question: CompositionInputProps["questions"][number];
}) => {
  return (
    <Sequence
      key={`${scene.type}-${scene.questionIndex}-${scene.from}`}
      from={scene.from}
      durationInFrames={scene.durationInFrames}
    >
      <AbsoluteFill style={questionLayoutStyle}>
        <Header scene={scene} totalQuestions={questionCount} />
        <div style={{ marginTop: 38 }}>
          <AnswerContent
            question={question.question}
            answers={getAnswerOptions(question)}
            correctAnswerIndex={getCorrectAnswerIndex(question)}
          />
        </div>
      </AbsoluteFill>
      <Html5Audio src={resolveAudioSrc(ANSWER_CORRECT_SFX_SRC)} volume={1} />
      <Html5Audio src={resolveAudioSrc(scene.audioSrc)} />
    </Sequence>
  );
};

export const Main = ({ questions }: CompositionInputProps) => {
  const { fps } = useVideoConfig();
  const [renderHandle] = useState(() => delayRender("Loading quiz timeline"));
  const isRenderHandleResolvedRef = useRef(false);
  const [timeline, setTimeline] = useState<QuizTimeline | null>(null);
  const [timelineError, setTimelineError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    setTimeline(null);
    setTimelineError(null);

    const loadTimeline = async () => {
      try {
        const nextTimeline = await buildQuizTimeline(questions, fps);

        if (cancelled) {
          return;
        }

        setTimeline(nextTimeline);
      } catch (error) {
        if (cancelled) {
          return;
        }

        const resolvedError =
          error instanceof Error
            ? error
            : new Error("Falha ao calcular timeline do quiz.");
        setTimelineError(resolvedError);
      } finally {
        if (!cancelled && !isRenderHandleResolvedRef.current) {
          isRenderHandleResolvedRef.current = true;
          continueRender(renderHandle);
        }
      }
    };

    void loadTimeline();

    return () => {
      cancelled = true;
    };
  }, [fps, questions, renderHandle]);

  if (timelineError) {
    throw timelineError;
  }

  if (!timeline) {
    return null;
  }

  return (
    <AbsoluteFill>
      <Background />
      <Html5Audio src={resolveAudioSrc(BGM_SRC)} volume={0.1} loop />

      {timeline.scenes.map((scene) => {
        const question = questions[scene.questionIndex];
        if (!question) {
          return null;
        }

        if (scene.type === "question") {
          return (
            <QuestionSequence
              key={`${scene.type}-${scene.questionIndex}-${scene.from}`}
              questionCount={questions.length}
              scene={scene}
              question={question}
            />
          );
        }

        if (scene.type === "countdown") {
          return (
            <CountdownSequence
              key={`${scene.type}-${scene.questionIndex}-${scene.from}`}
              questionCount={questions.length}
              scene={scene}
              question={question}
            />
          );
        }

        return (
          <AnswerSequence
            key={`${scene.type}-${scene.questionIndex}-${scene.from}`}
            questionCount={questions.length}
            scene={scene}
            question={question}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export default Main;
