import { QuestionBubble } from "./QuestionBubble";

type QuestionContentProps = {
  question: string;
};

export const QuestionContent = ({ question }: QuestionContentProps) => {
  return <QuestionBubble text={question} />;
};

export default QuestionContent;
