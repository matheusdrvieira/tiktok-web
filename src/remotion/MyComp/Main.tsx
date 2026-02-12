import { z } from "zod";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  CompositionProps,
  DEFAULT_QUIZ_QUESTIONS,
  QUESTION_DURATION_SECONDS,
  QUIZ_QUESTION_COUNT,
} from "../../../types/constants";
import { loadFont, fontFamily } from "@remotion/google-fonts/ComicNeue";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

export const Main = ({ title, questions }: z.infer<typeof CompositionProps>) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const introDurationInFrames = Math.round(1.8 * fps);
  const framesPerQuestion = QUESTION_DURATION_SECONDS * fps;
  const quizQuestions =
    questions.length === QUIZ_QUESTION_COUNT ? questions : DEFAULT_QUIZ_QUESTIONS;
  const questionIndex = Math.min(
    quizQuestions.length - 1,
    QUIZ_QUESTION_COUNT - 1,
    Math.floor(frame / framesPerQuestion),
  );
  const frameInQuestion = frame % framesPerQuestion;
  const currentQuestion = quizQuestions[questionIndex] ?? DEFAULT_QUIZ_QUESTIONS[0];
  const secondsLeft = Math.max(
    0,
    QUESTION_DURATION_SECONDS - Math.floor(frameInQuestion / fps),
  );

  const bubbleIn = spring({
    fps,
    frame: frameInQuestion,
    config: {
      damping: 16,
      mass: 0.9,
    },
    durationInFrames: Math.min(20, framesPerQuestion),
  });

  const bubbleScale = interpolate(bubbleIn, [0, 1], [0.88, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const timerProgress = 1 - frameInQuestion / framesPerQuestion;
  const introVisible = frame < introDurationInFrames;
  const introProgress = interpolate(
    frame,
    [0, introDurationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const introScale = interpolate(
    frame,
    [0, introDurationInFrames],
    [1, 1.05],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#f5f0df" }}>
      <AbsoluteFill>
        {[
          { color: "#ffcc00", top: -70, left: -110, rotate: "-8deg" },
          { color: "#f87171", top: -100, right: -120, rotate: "10deg" },
          { color: "#4ade80", bottom: -120, left: -100, rotate: "8deg" },
          { color: "#f59e0b", bottom: -120, right: -110, rotate: "-10deg" },
        ].map((panel, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              width: 420,
              height: 420,
              backgroundColor: panel.color,
              border: "12px solid #111",
              transform: `rotate(${panel.rotate})`,
              ...panel,
            }}
          />
        ))}
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          margin: "88px 56px",
          border: "14px solid #111",
          borderRadius: 34,
          overflow: "hidden",
          background:
            "radial-gradient(circle at 20% 20%, #5f8dff 0%, #3b6af7 50%, #2a45b5 100%)",
        }}
      >
        <AbsoluteFill
          style={{
            opacity: 0.25,
            backgroundImage:
              "radial-gradient(#0f172a 1.8px, transparent 1.8px)",
            backgroundSize: "14px 14px",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 26,
            left: "50%",
            transform: "translateX(-50%)",
            width: 252,
            height: 68,
            borderRadius: 999,
            border: "6px solid #111",
            backgroundColor: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 0 rgba(0,0,0,0.2)",
            fontFamily,
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: 1,
            color: "#111",
          }}
        >
          {secondsLeft}s
        </div>

        <div
          style={{
            position: "absolute",
            top: 106,
            left: "50%",
            transform: "translateX(-50%)",
            width: 260,
            height: 14,
            borderRadius: 999,
            border: "3px solid #111",
            backgroundColor: "rgba(255,255,255,0.5)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${Math.max(0, timerProgress) * 100}%`,
              backgroundColor: "#f97316",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: 148,
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            color: "#fff",
            textShadow: "0 4px 0 rgba(0,0,0,0.3)",
            fontFamily,
          }}
        >
          <div
            style={{
              fontSize: 88,
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            {(title || "GEOGRAPHY").toUpperCase()}
          </div>
          <div
            style={{
              fontSize: 90,
              lineHeight: 0.95,
              fontWeight: 700,
              letterSpacing: 3,
            }}
          >
            QUIZ
          </div>
        </div>

        {introVisible ? (
          <AbsoluteFill
            style={{
              background: "rgba(9, 14, 43, 0.82)",
              alignItems: "center",
              justifyContent: "center",
              opacity: introProgress,
              transform: `scale(${introScale})`,
            }}
          >
            <div
              style={{
                border: "8px solid #111",
                borderRadius: 28,
                backgroundColor: "#fff",
                boxShadow: "0 14px 0 rgba(0,0,0,0.22)",
                padding: "28px 40px",
                textAlign: "center",
                maxWidth: 820,
                width: "calc(100% - 120px)",
                fontFamily,
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "8px 18px",
                  border: "4px solid #111",
                  borderRadius: 999,
                  backgroundColor: "#ffdd57",
                  color: "#111",
                  fontWeight: 700,
                  fontSize: 36,
                  marginBottom: 18,
                  letterSpacing: 1.2,
                }}
              >
                QUIZZIO MANIA
              </div>
              <div
                style={{
                  fontSize: 64,
                  fontWeight: 700,
                  lineHeight: 1.05,
                  color: "#0f172a",
                  textTransform: "uppercase",
                  textShadow: "0 3px 0 rgba(15,23,42,0.12)",
                }}
              >
                Apresenta
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 42,
                  fontWeight: 700,
                  color: "#1f3b8e",
                  textTransform: "uppercase",
                }}
              >
                Desafio de quiz rapido
              </div>
            </div>
          </AbsoluteFill>
        ) : null}

        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            top: 480,
            border: "10px solid #111",
            borderRadius: 48,
            backgroundColor: "#fffef8",
            padding: "42px 40px",
            transform: `scale(${bubbleScale})`,
            transformOrigin: "center center",
            boxShadow: "0 16px 0 rgba(0,0,0,0.22)",
            fontFamily,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              border: "4px solid #111",
              borderRadius: 999,
              padding: "8px 16px",
              fontSize: 34,
              fontWeight: 700,
              marginBottom: 20,
              backgroundColor: "#fff",
            }}
          >
            PERGUNTA {questionIndex + 1}/{QUIZ_QUESTION_COUNT}
          </div>
          <div
            style={{
              fontSize: 56,
              lineHeight: 1.16,
              color: "#0f172a",
              fontWeight: 700,
            }}
          >
            {currentQuestion.question}
          </div>

          <div
            style={{
              position: "absolute",
              left: 130,
              bottom: -32,
              width: 66,
              height: 66,
              backgroundColor: "#fffef8",
              borderRight: "10px solid #111",
              borderBottom: "10px solid #111",
              transform: "rotate(44deg)",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            bottom: 112,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 18,
            fontFamily,
          }}
        >
          {currentQuestion.options.map((option, index) => (
            <div
              key={`${index}-${option}`}
              style={{
                border: "6px solid #111",
                borderRadius: 24,
                backgroundColor: "#fff",
                minHeight: 124,
                display: "flex",
                alignItems: "center",
                padding: "18px 18px",
                fontSize: 34,
                fontWeight: 700,
                color: "#0f172a",
                boxShadow: "0 8px 0 rgba(0,0,0,0.2)",
              }}
            >
              <span style={{ marginRight: 14 }}>{String.fromCharCode(65 + index)}.</span>
              <span>{option}</span>
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
