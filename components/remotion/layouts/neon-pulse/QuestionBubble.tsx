import { neonFontFamily } from "../../comic-font";

type QuestionBubbleProps = {
  text: string;
};

const getFontSize = (text: string): number => {
  if (text.length > 130) {
    return 48;
  }

  if (text.length > 95) {
    return 54;
  }

  if (text.length > 70) {
    return 60;
  }

  return 66;
};

export const QuestionBubble = ({ text }: QuestionBubbleProps) => {
  const fontSize = getFontSize(text);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            borderRadius: 14,
            border: "4px solid #166534",
            background: "linear-gradient(180deg, #22c55e 0%, #16a34a 100%)",
            color: "#f0fdf4",
            padding: "10px 24px 12px",
            fontFamily: neonFontFamily,
            fontSize: 40,
            fontWeight: 800,
            letterSpacing: 1,
            textTransform: "uppercase",
            boxShadow: "0 8px 14px rgba(22, 101, 52, 0.3)",
          }}
        >
          Pensa Rapido!
        </div>
      </div>

      <div
        style={{
          position: "relative",
          borderRadius: 18,
          border: "8px solid #8b5a2b",
          background: "linear-gradient(180deg, #c28b4c 0%, #9a6a3f 100%)",
          padding: 16,
          boxShadow: "0 12px 18px rgba(0, 0, 0, 0.25)",
        }}
      >
        <div
          style={{
            borderRadius: 10,
            border: "4px solid #facc15",
            background:
              "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%), linear-gradient(180deg, #111827 0%, #05070f 100%)",
            minHeight: 340,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "36px 32px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(rgba(59,130,246,0.16) 1px, transparent 1px)",
              backgroundSize: "10px 10px",
              opacity: 0.28,
            }}
          />

          <div
            style={{
              position: "relative",
              color: "#f8fafc",
              textAlign: "center",
              fontFamily: neonFontFamily,
              fontSize,
              fontWeight: 700,
              lineHeight: 1.14,
              textWrap: "balance",
              textShadow: "0 2px 0 rgba(15, 23, 42, 0.6)",
            }}
          >
            {text}
          </div>

          <div
            style={{
              position: "absolute",
              left: 72,
              right: 72,
              bottom: 34,
              height: 8,
              borderRadius: 999,
              background: "linear-gradient(90deg, #facc15 0%, #fde047 100%)",
              boxShadow: "0 0 10px rgba(250, 204, 21, 0.5)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionBubble;
