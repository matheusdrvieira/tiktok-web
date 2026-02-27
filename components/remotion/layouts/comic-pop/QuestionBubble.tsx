import { comicFontFamily } from "../../comic-font";

type QuestionBubbleProps = {
  text: string;
};

const getFontSize = (text: string): number => {
  if (text.length > 130) {
    return 38;
  }

  if (text.length > 90) {
    return 44;
  }

  if (text.length > 60) {
    return 50;
  }

  return 56;
};

export const QuestionBubble = ({ text }: QuestionBubbleProps) => {
  const fontSize = getFontSize(text);

  return (
    <div style={{ position: "relative", paddingBottom: 26 }}>
      <div
        style={{
          position: "relative",
          borderRadius: 34,
          border: `6px solid #0f172a`,
          background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(243,247,252,0.98) 100%)",
          padding: "30px 40px",
          boxShadow: "0 10px 0 rgba(15, 23, 42, 0.3), 0 16px 24px rgba(15, 23, 42, 0.24), inset 0 0 0 3px rgba(255,255,255,0.78)",
          fontFamily: comicFontFamily,
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `radial-gradient(rgba(15,23,42,0.08) 1.1px, transparent 1.1px)`,
            backgroundSize: "12px 12px",
            opacity: 0.35,
          }}
        />

        <div
          style={{
            position: "relative",
            fontSize,
            lineHeight: 1.12,
            color: "#0f172a",
            fontWeight: 800,
          }}
        >
          {text}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 70,
          bottom: 0,
          width: 42,
          height: 42,
          backgroundColor: "rgba(248, 250, 252, 0.98)",
          borderLeft: `6px solid #0f172a`,
          borderBottom: `6px solid #0f172a`,
          borderBottomLeftRadius: 12,
          transform: "rotate(45deg)",
          boxShadow: "6px 6px 0 rgba(15, 23, 42, 0.2)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 36,
          bottom: 8,
          width: 20,
          height: 20,
          borderRadius: "999px",
          backgroundColor: "rgba(248, 250, 252, 0.98)",
          border: `4px solid #0f172a`,
        }}
      />
    </div>
  );
};

export default QuestionBubble;
