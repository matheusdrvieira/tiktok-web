import { Composition, type CalculateMetadataFunction } from "remotion";
import {
  COMP_NAME,
  DEFAULT_QUIZ_CONTENT,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
  type CompositionInputProps,
} from "./constants";
import { Main } from "./Main";
import { buildQuizTimeline } from "./quiz-timeline";

const calculateMetadata: CalculateMetadataFunction<CompositionInputProps> = async ({
  props,
}) => {
  const timeline = await buildQuizTimeline(props.questions, VIDEO_FPS);

  return {
    durationInFrames: timeline.totalDurationInFrames,
  };
};

export const RemotionRoot = () => {
  return (
    <Composition
      id={COMP_NAME}
      component={Main}
      durationInFrames={DURATION_IN_FRAMES}
      fps={VIDEO_FPS}
      width={VIDEO_WIDTH}
      height={VIDEO_HEIGHT}
      defaultProps={DEFAULT_QUIZ_CONTENT}
      calculateMetadata={calculateMetadata}
    />
  );
};

export default RemotionRoot;
