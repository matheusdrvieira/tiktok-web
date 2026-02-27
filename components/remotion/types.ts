export type TimelineBaseScene = {
  from: number;
  durationInFrames: number;
};

export type QuestionScene = TimelineBaseScene & {
  type: "question";
  questionIndex: number;
  audioSrc: string;
};

export type CountdownScene = TimelineBaseScene & {
  type: "countdown";
  questionIndex: number;
};

export type AnswerScene = TimelineBaseScene & {
  type: "answer";
  questionIndex: number;
  audioSrc: string;
};

export type QuizScene = QuestionScene | CountdownScene | AnswerScene;

export type QuizTimeline = {
  scenes: QuizScene[];
  totalDurationInFrames: number;
};
