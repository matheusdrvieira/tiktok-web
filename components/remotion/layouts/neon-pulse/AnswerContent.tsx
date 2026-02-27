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
    <div style={{ display: "flex", flexDirection: "column", gap: 62 }}>
      <QuestionBubble text={question} />
      <OptionsList answers={answers} highlightedIndex={highlightedIndex} />
    </div>
  );
};

export default AnswerContent;
