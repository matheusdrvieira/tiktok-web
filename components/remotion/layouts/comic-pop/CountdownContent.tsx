import { OptionsList } from "./OptionsList";
import { QuestionBubble } from "./QuestionBubble";

type CountdownContentProps = {
  question: string;
  answers: string[];
};

export const CountdownContent = ({ question, answers }: CountdownContentProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ height: 260 }}>
        <QuestionBubble text={question} />
      </div>

      <div style={{ marginTop: 236 }}>
        <OptionsList answers={answers} />
      </div>
    </div>
  );
};

export default CountdownContent;
