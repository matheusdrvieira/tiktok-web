import { Img, staticFile, useCurrentFrame } from "remotion";
import { neonFontFamily } from "../../comic-font";
import { COUNTDOWN_SECONDS } from "../../constants";
import type { QuizScene } from "../../types";

type HeaderProps = {
  scene: QuizScene;
  totalQuestions: number;
};

const getCounterLabel = (scene: QuizScene, frame: number): string => {
  if (scene.type === "countdown") {
    const progress = Math.min(1, frame / Math.max(1, scene.durationInFrames));
    const secondsLeft = Math.max(
      1,
      COUNTDOWN_SECONDS - Math.floor(progress * COUNTDOWN_SECONDS),
    );

    return String(secondsLeft);
  }

  return String(scene.questionIndex + 1);
};

const getStatusLabel = (scene: QuizScene): string => {
  if (scene.type === "question") {
    return "Escute";
  }

  if (scene.type === "countdown") {
    return "Valendo";
  }

  return "Resposta";
};

const getStatusStyle = (scene: QuizScene): { background: string; color: string } => {
  if (scene.type === "answer") {
    return {
      background: "linear-gradient(180deg, #16a34a 0%, #15803d 100%)",
      color: "#f0fdf4",
    };
  }

  if (scene.type === "countdown") {
    return {
      background: "linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)",
      color: "#eff6ff",
    };
  }

  return {
    background: "linear-gradient(180deg, #1d4ed8 0%, #1e40af 100%)",
    color: "#eff6ff",
  };
};

export const Header = ({ scene, totalQuestions }: HeaderProps) => {
  const frame = useCurrentFrame();
  const counterLabel = getCounterLabel(scene, frame);
  const statusLabel = getStatusLabel(scene);
  const statusStyle = getStatusStyle(scene);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        fontFamily: neonFontFamily,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "120px 1fr 120px",
          alignItems: "center",
          columnGap: 14,
        }}
      >
        <div />

        <div />

        <div
          style={{
            width: 92,
            height: 92,
            borderRadius: "999px",
            border: "4px solid #be185d",
            background: "linear-gradient(180deg, #fde047 0%, #facc15 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            justifySelf: "end",
            color: "#9d174d",
            fontSize: 52,
            fontWeight: 800,
            lineHeight: 1,
            boxShadow: "0 8px 14px rgba(157, 23, 77, 0.25)",
          }}
          title={`Pergunta ${scene.questionIndex + 1} de ${totalQuestions}`}
        >
          {counterLabel}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -112,
            width: 244,
            height: 168,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          <Img
            src={staticFile("mascote.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
              transform: "translateY(2px) scale(1.06)",
              filter: "drop-shadow(0 7px 10px rgba(15, 23, 42, 0.34))",
            }}
          />
        </div>

        <div
          style={{
            ...statusStyle,
            minWidth: 470,
            borderRadius: 999,
            border: "3px solid rgba(255,255,255,0.78)",
            padding: "10px 26px",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 0.8,
            textAlign: "center",
            textTransform: "uppercase",
            boxShadow: "0 8px 16px rgba(30, 64, 175, 0.25)",
            marginTop: 26,
          }}
        >
          Pergunta {scene.questionIndex + 1}/{totalQuestions} • {statusLabel}
        </div>
      </div>
    </div>
  );
};

export default Header;
