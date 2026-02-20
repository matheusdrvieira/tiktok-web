import { comicFontFamily } from "../comic-font";

const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

type OptionsListProps = {
  answers: string[];
  highlightedIndex?: number;
};

export const OptionsList = ({ answers, highlightedIndex }: OptionsListProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 54,
        fontFamily: comicFontFamily,
      }}
    >
      {answers?.map((answer, index) => {
        const isHighlighted = highlightedIndex === index;

        return (
          <div
            key={`${index}-${answer}`}
            style={{
              minHeight: 172,
              borderRadius: 32,
              backgroundColor: "rgba(15, 23, 42, 0.28)",
              display: "grid",
              gridTemplateColumns: "84px 1fr 84px",
              alignItems: "center",
              padding: "0 22px",
              fontSize: 42,
              lineHeight: 1.06,
              fontWeight: 800,
              color: "#ffffff",
              textShadow: "0 4px 10px rgba(2, 6, 23, 0.8)",
            }}
          >
            <span
              style={{
                borderRadius: 14,
                backgroundColor: isHighlighted
                  ? "rgba(22, 163, 74, 0.9)"
                  : "rgba(15, 23, 42, 0.74)",
                fontSize: 36,
                fontWeight: 800,
                lineHeight: 1,
                textAlign: "center",
                padding: "11px 0",
              }}
            >
              {OPTION_LETTERS[index]}.
            </span>
            <span style={{ textAlign: "center" }}>{answer}</span>
          </div>
        );
      })}
    </div>
  );
};

export default OptionsList;
