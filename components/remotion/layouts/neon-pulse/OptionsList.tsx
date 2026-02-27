import { neonFontFamily } from "../../comic-font";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

type OptionsListProps = {
  answers: string[];
  highlightedIndex?: number;
};

const getOptionLetter = (index: number): string =>
  OPTION_LETTERS[index] ?? `${index + 1}`;

const getOptionFontSize = (text: string): number => {
  if (text.length > 16) {
    return 48;
  }

  if (text.length > 10) {
    return 54;
  }

  return 60;
};

export const OptionsList = ({ answers, highlightedIndex }: OptionsListProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        fontFamily: neonFontFamily,
      }}
    >
      {answers.map((answer, index) => {
        const isHighlighted = highlightedIndex === index;

        return (
          <div
            key={`${index}-${answer}`}
            style={{
              position: "relative",
              minHeight: 114,
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
                width: 98,
                height: 98,
                borderRadius: "999px",
                border: `4px solid ${isHighlighted ? "#166534" : "#be185d"}`,
                background: isHighlighted
                  ? "linear-gradient(180deg, #4ade80 0%, #22c55e 100%)"
                  : "linear-gradient(180deg, #f72585 0%, #db2777 100%)",
                color: "#ffffff",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 56,
                fontWeight: 900,
                lineHeight: 1,
                boxShadow: isHighlighted
                  ? "0 8px 14px rgba(22, 101, 52, 0.3)"
                  : "0 8px 14px rgba(157, 23, 77, 0.3)",
              }}
            >
              {getOptionLetter(index)}
            </span>

            <div
              style={{
                width: "100%",
                marginLeft: 46,
                minHeight: 104,
                borderRadius: 20,
                border: `4px solid ${isHighlighted ? "#166534" : "#a1a1aa"}`,
                background: isHighlighted
                  ? "linear-gradient(180deg, #dcfce7 0%, #bbf7d0 100%)"
                  : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 32px 0 52px",
                boxShadow: "0 8px 14px rgba(0, 0, 0, 0.16)",
              }}
            >
              <span
                style={{
                  color: "#111827",
                  textAlign: "center",
                  fontSize: getOptionFontSize(answer),
                  fontWeight: 800,
                  lineHeight: 1,
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
