import { useEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Html5Audio,
  Img,
  Sequence,
  continueRender,
  delayRender,
  staticFile,
  useVideoConfig,
} from "remotion";
import type { CompositionInputProps } from "./constants";
import { AnswerContent } from "./content/AnswerContent";
import { CountdownContent } from "./content/CountdownContent";
import { IntroContent } from "./content/IntroContent";
import { QuestionContent } from "./content/QuestionContent";
import { Header } from "./Header";
import {
  ANSWER_CORRECT_SFX_SRC,
  BGM_SRC,
  COUNTDOWN_MUSIC_SRC,
  buildQuizTimeline,
  type AnswerScene,
  type CountdownScene,
  type QuestionScene,
  type QuizTimeline,
} from "./quiz-timeline";

const QUESTION_LAYOUT_STYLE = {
  display: "flex",
  flexDirection: "column" as const,
  paddingTop: 329,
  paddingLeft: 70,
  paddingRight: 70,
};

const resolveAudioSrc = (src: string): string =>
  src.startsWith("/") ? staticFile(src.replace(/^\/+/, "")) : src;

const getAnswerOptions = (
  question: CompositionInputProps["questions"][number],
): string[] =>
  question.options.map((option: { text: string }) => option.text);

const getCorrectAnswerText = (
  question: CompositionInputProps["questions"][number],
): string => {
  const correctOption = question.options.find(
    (option: { id: string }) => option.id === question.answer.correctOptionId,
  );

  return correctOption?.text ?? question.options[0]?.text ?? "";
};

const Background = () => {
  return (
    <AbsoluteFill>
      <Img
        src={staticFile("background.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </AbsoluteFill>
  );
};

const IntroSequence = ({
  scene,
  questionCount,
}: {
  scene: QuizTimeline["scenes"][number];
  questionCount: number;
}) => {
  return (
    <Sequence
      key={`${scene.type}-${scene.from}`}
      from={scene.from}
      durationInFrames={scene.durationInFrames}
    >
      <AbsoluteFill style={QUESTION_LAYOUT_STYLE}>
        <Header scene={scene} totalQuestions={questionCount} />
        <div style={{ marginTop: 2 }}>
          <IntroContent />
        </div>
      </AbsoluteFill>
    </Sequence>
  );
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
      <AbsoluteFill style={QUESTION_LAYOUT_STYLE}>
        <Header scene={scene} totalQuestions={questionCount} />
        <div style={{ marginTop: 2 }}>
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
      <AbsoluteFill style={QUESTION_LAYOUT_STYLE}>
        <Header scene={scene} totalQuestions={questionCount} />
        <div style={{ marginTop: 2 }}>
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
      <AbsoluteFill style={QUESTION_LAYOUT_STYLE}>
        <Header scene={scene} totalQuestions={questionCount} />
        <div style={{ marginTop: 2 }}>
          <AnswerContent
            question={question.question}
            answers={getAnswerOptions(question)}
            correctAnswer={getCorrectAnswerText(question)}
          />
        </div>
      </AbsoluteFill>
      <Html5Audio src={resolveAudioSrc(ANSWER_CORRECT_SFX_SRC)} volume={1} />
      <Html5Audio src={resolveAudioSrc(scene.audioSrc)} />
    </Sequence>
  );
};

const QuizVideo = ({ questions }: CompositionInputProps) => {
  const { fps } = useVideoConfig();
  const [renderHandle] = useState(() => delayRender("Loading quiz timeline"));
  const isRenderHandleResolvedRef = useRef(false);
  const [timeline, setTimeline] = useState<QuizTimeline | null>(null);
  const [timelineError, setTimelineError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

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

  if (timelineError) throw timelineError;
  if (!timeline) return null;

  return (
    <AbsoluteFill>
      <Background />
      <Html5Audio src={resolveAudioSrc(BGM_SRC)} volume={0.1} loop />;

      {timeline.scenes.map((scene) => {
        if (scene.type === "intro") {
          return (
            <IntroSequence
              key={`${scene.type}-${scene.from}`}
              scene={scene}
              questionCount={questions.length}
            />
          );
        }

        const question = questions[scene.questionIndex]!;

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

export const Main = QuizVideo;
export default QuizVideo;
