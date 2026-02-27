import { comicFontFamily } from "../../comic-font";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"] as const;
const OPTION_GAP = 100;
const OPTION_BALLOON_HEIGHT = 126;

type OptionsListProps = {
  answers: string[];
  highlightedIndex?: number;
};

const getOptionLetter = (index: number): string =>
  OPTION_LETTERS[index] ?? `${index + 1}`;

export const OptionsList = ({ answers, highlightedIndex }: OptionsListProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: OPTION_GAP,
        fontFamily: comicFontFamily,
      }}
    >
      {answers.map((answer, index) => {
        const isHighlighted = highlightedIndex === index;

        return (
          <div
            key={`${index}-${answer}`}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 2,
                width: 96,
                height: 96,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "999px",
                border: `5px solid ${isHighlighted ? "#166534" : "#0f172a"}`,
                background: isHighlighted
                  ? "linear-gradient(180deg, #4ade80 0%, #16a34a 100%)"
                  : "linear-gradient(180deg, #203a5f 0%, #122844 100%)",
                color: "#ffffff",
                fontSize: 50,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: 0.8,
              }}
            >
              {getOptionLetter(index)}
            </span>

            <div
              style={{
                position: "relative",
                width: "100%",
                marginLeft: 44,
                minHeight: OPTION_BALLOON_HEIGHT,
                borderRadius: 28,
                border: `5px solid ${isHighlighted ? "#166534" : "#0f172a"}`,
                background: isHighlighted
                  ? "linear-gradient(180deg, rgba(220, 252, 231, 0.98) 0%, rgba(187, 247, 208, 0.98) 100%)"
                  : "linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(243, 247, 252, 0.98) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 26px 0 60px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: isHighlighted ? 0.16 : 0.22,
                  backgroundImage:
                    "radial-gradient(rgba(15,23,42,0.22) 1px, transparent 1px)",
                  backgroundSize: "14px 14px",
                }}
              />
              <span
                style={{
                  position: "relative",
                  textAlign: "center",
                  color: "#0f172a",
                  fontSize: 50,
                  lineHeight: 1.02,
                  fontWeight: 800,
                  textWrap: "balance",
                }}
              >
                {answer}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OptionsList;
