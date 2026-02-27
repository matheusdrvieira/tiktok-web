import { sunsetFontFamily } from "../../comic-font";

type QuestionBubbleProps = {
  text: string;
};

const SPIRAL_COUNT = 8;
const SPIRAL_INDEXES = Array.from({ length: SPIRAL_COUNT }, (_, index) => index);

const getFontSize = (text: string): number => {
  if (text.length > 130) {
    return 56;
  }

  if (text.length > 95) {
    return 62;
  }

  if (text.length > 70) {
    return 68;
  }

  return 74;
};

export const QuestionBubble = ({ text }: QuestionBubbleProps) => {
  const fontSize = getFontSize(text);

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "relative",
          borderRadius: 28,
          border: "4px solid #a1a1aa",
          background:
            "repeating-linear-gradient(180deg, #ffffff 0 70px, #e0f2fe 70px 76px)",
          padding: "40px 36px 36px 96px",
          boxShadow: "0 12px 22px rgba(0, 0, 0, 0.18)",
          overflow: "hidden",
          fontFamily: sunsetFontFamily,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 64,
            borderRight: "3px solid #94a3b8",
            background: "linear-gradient(180deg, #d9ea3b 0%, #c9dd27 100%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 78,
            top: 0,
            bottom: 0,
            width: 4,
            background: "rgba(244, 63, 94, 0.45)",
          }}
        />

        <div
          style={{
          color: "#111827",
          fontSize,
          fontWeight: 800,
          lineHeight: 1.12,
          textAlign: "center",
          textWrap: "balance",
        }}
        >
          {text}
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            top: 24,
            bottom: 24,
            width: 64,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {SPIRAL_INDEXES.map((index) => (
            <span
              key={index}
              style={{
                width: 20,
                height: 20,
                borderRadius: "999px",
                border: "2px solid #94a3b8",
                background: "#ffffff",
                boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.14)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionBubble;
