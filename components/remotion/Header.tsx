import { Img, staticFile, useCurrentFrame } from "remotion";
import { comicFontFamily } from "./comic-font";
import { COUNTDOWN_SECONDS, type QuizScene } from "./quiz-timeline";

type HeaderProps = {
  scene: QuizScene;
  totalQuestions: number;
};

const getStatusLabel = (scene: QuizScene, frame: number): string => {
  if (scene.type === "intro") {
    return "PREPARE-SE";
  }

  if (scene.type === "question") {
    return "OUVINDO...";
  }

  if (scene.type === "countdown") {
    const progress = Math.min(1, frame / Math.max(1, scene.durationInFrames));
    const secondsLeft = Math.max(1, COUNTDOWN_SECONDS - Math.floor(progress * COUNTDOWN_SECONDS));
    return `${secondsLeft}s`;
  }

  return "RESPOSTA";
};

const getStatusColor = (scene: QuizScene): string => {
  if (scene.type === "answer") {
    return "#22c55e";
  }

  if (scene.type === "countdown") {
    return "#f59e0b";
  }

  return "#0f172a";
};

export const Header = ({ scene, totalQuestions }: HeaderProps) => {
  const frame = useCurrentFrame();
  const statusLabel = getStatusLabel(scene, frame);
  const statusColor = getStatusColor(scene);
  const isCountdown = scene.type === "countdown";
  const pulseScale = isCountdown ? 1 + Math.sin(frame * 0.35) * 0.04 : 1;
  const statusBackground = isCountdown
    ? "linear-gradient(180deg, #fbbf24 0%, #f59e0b 52%, #ea580c 100%)"
    : scene.type === "answer"
      ? "linear-gradient(180deg, #4ade80 0%, #22c55e 55%, #15803d 100%)"
      : `linear-gradient(180deg, ${statusColor} 0%, #0f172a 100%)`;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "stretch",
        columnGap: 20,
        fontFamily: comicFontFamily,
      }}
    >
      <div
        style={{
          alignSelf: "end",
          justifySelf: "start",
          minWidth: 180,
          padding: "10px 18px",
          borderRadius: 999,
          background: statusBackground,
          border: "3px solid #0f172a",
          color: "#ffffff",
          fontSize: 36,
          lineHeight: 1,
          fontWeight: 800,
          letterSpacing: 0.4,
          textAlign: "center",
          transform: `scale(${pulseScale})`,
          textShadow: "0 2px 0 rgba(15, 23, 42, 0.5)",
          boxShadow: isCountdown
            ? "0 6px 0 rgba(15, 23, 42, 0.3), 0 0 18px rgba(251, 146, 60, 0.45)"
            : "0 6px 0 rgba(15, 23, 42, 0.3), 0 10px 14px rgba(15, 23, 42, 0.24)",
        }}
      >
        {statusLabel}
      </div>

      <div
        style={{
          alignSelf: "center",
          justifySelf: "center",
          width: 220,
          height: 96,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "translateY(-10px)",
        }}
      >
        <Img
          src={staticFile("mascote.png")}
          style={{
            width: 460,
            height: 205,
            objectFit: "contain",
            filter: "drop-shadow(0 4px 8px rgba(15, 23, 42, 0.35))",
          }}
        />
      </div>

      {scene.type === "intro" ? (
        <div style={{ alignSelf: "end", justifySelf: "end", width: 220 }} />
      ) : (
        <div
          style={{
            alignSelf: "end",
            justifySelf: "end",
            position: "relative",
            borderRadius: 20,
            border: "4px solid #0f172a",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(243,247,252,0.98) 100%)",
            padding: "9px 20px 10px",
            overflow: "hidden",
            boxShadow:
              "0 5px 0 rgba(15, 23, 42, 0.3), 0 10px 14px rgba(15, 23, 42, 0.2), inset 0 0 0 2px rgba(255,255,255,0.75)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(rgba(15,23,42,0.1) 1px, transparent 1px)",
              backgroundSize: "10px 10px",
              opacity: 0.3,
            }}
          />
          <div
            style={{
              position: "relative",
              color: "#0f172a",
              fontSize: 28,
              lineHeight: 1,
              fontWeight: 800,
              letterSpacing: 0.35,
            }}
          >
            PERGUNTA {scene.questionIndex + 1}/{totalQuestions}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
