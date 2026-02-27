"use client";

import { Player } from "@remotion/player";
import { useEffect, useState } from "react";
import {
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "./constants";
import Main from "./Main";
import { buildQuizTimeline } from "./quiz-timeline";
import type { CompositionInputProps } from "./schemas/composition-props.schema";

type RemotionPreviewProps = {
  inputProps: CompositionInputProps;
};

const getPreviewDurationInFrames = async (
  questions: CompositionInputProps["questions"],
): Promise<number> => {
  try {
    const timeline = await buildQuizTimeline(questions, VIDEO_FPS);
    return timeline.totalDurationInFrames;
  } catch {
    return DURATION_IN_FRAMES;
  }
};

export const RemotionPreview = ({ inputProps }: RemotionPreviewProps) => {
  const [durationInFrames, setDurationInFrames] = useState(DURATION_IN_FRAMES);

  useEffect(() => {
    let cancelled = false;

    void getPreviewDurationInFrames(inputProps.questions).then((nextDurationInFrames) => {
      if (!cancelled) {
        setDurationInFrames(nextDurationInFrames);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [inputProps.questions]);

  return (
    <Player
      component={Main}
      inputProps={inputProps}
      durationInFrames={durationInFrames}
      fps={VIDEO_FPS}
      compositionHeight={VIDEO_HEIGHT}
      compositionWidth={VIDEO_WIDTH}
      acknowledgeRemotionLicense
      style={{ width: "100%", height: "100%" }}
      controls
      loop
    />
  );
};
