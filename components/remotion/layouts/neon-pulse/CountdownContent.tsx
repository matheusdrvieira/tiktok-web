import { OptionsList } from "./OptionsList";
import { QuestionBubble } from "./QuestionBubble";

type CountdownContentProps = {
  question: string;
  answers: string[];
};

export const CountdownContent = ({ question, answers }: CountdownContentProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 62 }}>
      <QuestionBubble text={question} />
      <OptionsList answers={answers} />
    </div>
  );
};

export default CountdownContent;
