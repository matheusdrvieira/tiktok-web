import { sunsetFontFamily } from "../../comic-font";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

type OptionsListProps = {
  answers: string[];
  highlightedIndex?: number;
};

const getOptionLetter = (index: number): string =>
  OPTION_LETTERS[index] ?? `${index + 1}`;

const getOptionFontSize = (text: string): number => {
  if (text.length > 16) {
    return 54;
  }

  if (text.length > 10) {
    return 60;
  }

  return 66;
};

export const OptionsList = ({ answers, highlightedIndex }: OptionsListProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 26,
        fontFamily: sunsetFontFamily,
      }}
    >
      {answers.map((answer, index) => {
        const isHighlighted = highlightedIndex === index;

        return (
          <div
            key={`${index}-${answer}`}
            style={{
              display: "flex",
              alignItems: "center",
              minHeight: 124,
            }}
          >
            <span
              style={{
                width: 98,
                height: 98,
                flexShrink: 0,
                borderRadius: "999px",
                border: `4px solid ${isHighlighted ? "#166534" : "#9d174d"}`,
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
                  ? "0 8px 16px rgba(22, 101, 52, 0.35)"
                  : "0 8px 16px rgba(157, 23, 77, 0.35)",
                zIndex: 2,
              }}
            >
              {getOptionLetter(index)}
            </span>

            <div
              style={{
                flex: 1,
                marginLeft: -49,
                minHeight: 124,
                borderRadius: 24,
                border: `4px solid ${isHighlighted ? "#166534" : "#71717a"}`,
                background: isHighlighted
                  ? "linear-gradient(180deg, #dcfce7 0%, #bbf7d0 100%)"
                  : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 36px",
                boxShadow: "0 8px 18px rgba(0, 0, 0, 0.16)",
              }}
            >
              <span
                style={{
                  color: "#111827",
                  fontSize: getOptionFontSize(answer),
                  fontWeight: 800,
                  lineHeight: 1,
                  textAlign: "center",
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
