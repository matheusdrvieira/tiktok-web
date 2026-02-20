import { OptionsList } from "./OptionsList";
import { QuestionBubble } from "./QuestionBubble";

type CountdownContentProps = {
  question: string;
  answers: string[];
};

const QUESTION_BLOCK_HEIGHT = 260;
const OPTIONS_OFFSET_TOP = 213;

export const CountdownContent = ({ question, answers }: CountdownContentProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ height: QUESTION_BLOCK_HEIGHT }}>
        <QuestionBubble text={question} />
      </div>

      <div style={{ marginTop: OPTIONS_OFFSET_TOP }}>
        <OptionsList answers={answers} />
      </div>
    </div>
  );
};

export default CountdownContent;
