import { Img, staticFile, useCurrentFrame } from "remotion";
import { COUNTDOWN_SECONDS } from "../../constants";
import { sunsetFontFamily } from "../../comic-font";
import type { QuizScene } from "../../types";

type HeaderProps = {
  scene: QuizScene;
  totalQuestions: number;
};

const getQuestionCounterLabel = (scene: QuizScene, totalQuestions: number): string =>
  `${String(scene.questionIndex + 1).padStart(2, "0")}/${String(totalQuestions).padStart(2, "0")}`;

const getTimerLabel = (scene: QuizScene, frame: number): string => {
  if (scene.type !== "countdown") {
    return String(COUNTDOWN_SECONDS).padStart(2, "0");
  }

  const progress = Math.min(1, frame / Math.max(1, scene.durationInFrames));
  const secondsLeft = Math.max(
    1,
    COUNTDOWN_SECONDS - Math.floor(progress * COUNTDOWN_SECONDS),
  );

  return String(secondsLeft).padStart(2, "0");
};

const getStatusLabel = (scene: QuizScene): string => {
  if (scene.type === "question") {
    return "Escute";
  }

  if (scene.type === "countdown") {
    return "Responda";
  }

  return "Correta";
};

const getStatusBg = (scene: QuizScene): string => {
  if (scene.type === "answer") {
    return "linear-gradient(180deg, #22c55e 0%, #15803d 100%)";
  }

  if (scene.type === "countdown") {
    return "linear-gradient(180deg, #ec4899 0%, #be185d 100%)";
  }

  return "linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)";
};

export const Header = ({ scene, totalQuestions }: HeaderProps) => {
  const frame = useCurrentFrame();
  const counterLabel = getQuestionCounterLabel(scene, totalQuestions);
  const timerLabel = getTimerLabel(scene, frame);
  const statusLabel = getStatusLabel(scene);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        fontFamily: sunsetFontFamily,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "160px 1fr 160px",
          alignItems: "center",
          columnGap: 16,
        }}
      >
        <div
          style={{
            justifySelf: "start",
            width: 152,
            padding: "12px 0 13px",
            borderRadius: 999,
            border: "4px solid #4c1d95",
            background: "linear-gradient(180deg, #ffffff 0%, #dbeafe 100%)",
            color: "#1d4ed8",
            fontSize: 34,
            fontWeight: 900,
            letterSpacing: 0.4,
            textAlign: "center",
            transform: "rotate(-8deg)",
            boxShadow: "0 10px 16px rgba(76, 29, 149, 0.24)",
          }}
          title={`Pergunta ${scene.questionIndex + 1} de ${totalQuestions}`}
        >
          {counterLabel}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 332,
              height: 186,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              transform: "translateY(50px)",
              zIndex: 2,
            }}
          >
            <Img
              src={staticFile("mascote.png")}
              style={{
                width: 320,
                height: 172,
                objectFit: "contain",
                filter: "drop-shadow(0 8px 14px rgba(76, 29, 149, 0.34))",
              }}
            />
          </div>
        </div>

        <div
          style={{
            justifySelf: "end",
            width: 106,
            height: 106,
            borderRadius: "999px",
            border: "4px solid #4c1d95",
            background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
            color: "#4c1d95",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 44,
            fontWeight: 900,
            lineHeight: 1,
            boxShadow: "0 8px 16px rgba(76, 29, 149, 0.25)",
          }}
          title="Timer"
        >
          {timerLabel}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            minWidth: 520,
            borderRadius: 999,
            border: "3px solid rgba(255,255,255,0.75)",
            background: getStatusBg(scene),
            color: "#ffffff",
            padding: "10px 28px",
            fontSize: 30,
            fontWeight: 800,
            letterSpacing: 0.5,
            textAlign: "center",
            textTransform: "uppercase",
            boxShadow: "0 10px 20px rgba(76, 29, 149, 0.26)",
          }}
        >
          {statusLabel}
        </div>
      </div>
    </div>
  );
};

export default Header;
