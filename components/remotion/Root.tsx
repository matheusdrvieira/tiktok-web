import { Composition, type CalculateMetadataFunction } from "remotion";
import {
  ANSWER_CORRECT_SFX_SRC,
  COMP_NAME,
  COUNTDOWN_MUSIC_SRC,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "./constants";
import { QuizTemplateEnum } from "./enums";
import Main from "./Main";
import { buildQuizTimeline } from "./quiz-timeline";
import type { CompositionInputProps } from "./schemas/composition-props.schema";

const calculateMetadata: CalculateMetadataFunction<CompositionInputProps> = async ({
  props,
}) => {
  const timeline = await buildQuizTimeline(props.questions, VIDEO_FPS);

  return {
    durationInFrames: timeline.totalDurationInFrames,
  };
};

const defaultCompositionProps: CompositionInputProps = {
  title: "Quiz",
  templateId: QuizTemplateEnum.SunsetWave,
  questions: Array.from({ length: 4 }, (_, index) => {
    const questionId = `question-${index + 1}`;
    const optionAId = `option-${index + 1}-a`;
    const optionBId = `option-${index + 1}-b`;
    const optionCId = `option-${index + 1}-c`;
    const optionDId = `option-${index + 1}-d`;

    return {
      id: questionId,
      question: `Pergunta ${index + 1}?`,
      options: [
        { id: optionAId, text: "Opcao A" },
        { id: optionBId, text: "Opcao B" },
        { id: optionCId, text: "Opcao C" },
        { id: optionDId, text: "Opcao D" },
      ],
      answer: {
        correctAnswerIndex: 0,
      },
      questionPath: COUNTDOWN_MUSIC_SRC,
      answerCorrectPath: ANSWER_CORRECT_SFX_SRC,
    };
  }),
};

export default function RemotionRoot() {
  return (
    <Composition
      id={COMP_NAME}
      component={Main}
      defaultProps={defaultCompositionProps}
      durationInFrames={DURATION_IN_FRAMES}
      fps={VIDEO_FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      calculateMetadata={calculateMetadata}
    />
  );
};
