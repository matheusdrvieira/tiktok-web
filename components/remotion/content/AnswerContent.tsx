import { OptionsList } from "./OptionsList";
import { QuestionBubble } from "./QuestionBubble";

type AnswerContentProps = {
  question: string;
  answers: string[];
  correctAnswer: string;
};

const normalize = (value: string): string => value.trim().toLowerCase();
const QUESTION_BLOCK_HEIGHT = 260;
const OPTIONS_OFFSET_TOP = 213;

export const AnswerContent = ({ question, answers, correctAnswer }: AnswerContentProps) => {
  const highlightedIndex = Math.max(
    0,
    answers.findIndex((answer) => normalize(answer) === normalize(correctAnswer)),
  );

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ height: QUESTION_BLOCK_HEIGHT }}>
        <QuestionBubble text={question} />
      </div>

      <div style={{ marginTop: OPTIONS_OFFSET_TOP }}>
        <OptionsList answers={answers} highlightedIndex={highlightedIndex} />
      </div>
    </div>
  );
};

export default AnswerContent;
