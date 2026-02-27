import { OptionsList } from "./OptionsList";
import { QuestionBubble } from "./QuestionBubble";

type AnswerContentProps = {
  question: string;
  answers: string[];
  correctAnswerIndex: number;
};

export const AnswerContent = ({
  question,
  answers,
  correctAnswerIndex,
}: AnswerContentProps) => {
  const highlightedIndex = Number.isInteger(correctAnswerIndex)
    ? Math.max(0, Math.min(correctAnswerIndex, Math.max(0, answers.length - 1)))
    : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ height: 260 }}>
        <QuestionBubble text={question} />
      </div>

      <div style={{ marginTop: 236 }}>
        <OptionsList
          answers={answers}
          highlightedIndex={highlightedIndex}
        />
      </div>
    </div>
  );
};

export default AnswerContent;
