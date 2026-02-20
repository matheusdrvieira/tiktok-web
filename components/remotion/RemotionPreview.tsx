"use client";

import { Player } from "@remotion/player";
import { useEffect, useState } from "react";
import {
  DEFAULT_QUIZ_CONTENT,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
  type CompositionInputProps
} from "./constants";
import { Main } from "./Main";
import { buildQuizTimeline } from "./quiz-timeline";

type RemotionPreviewProps = {
  inputProps?: CompositionInputProps;
};

export const RemotionPreview = ({ inputProps = DEFAULT_QUIZ_CONTENT }: RemotionPreviewProps) => {
  const [durationInFrames, setDurationInFrames] = useState(DURATION_IN_FRAMES);

  useEffect(() => {
    let isMounted = true;

    void buildQuizTimeline(inputProps.questions, VIDEO_FPS)
      .then((timeline) => {
        if (isMounted) {
          setDurationInFrames(timeline.totalDurationInFrames);
        }
      })
      .catch(() => {
        if (isMounted) {
          setDurationInFrames(DURATION_IN_FRAMES);
        }
      });

    return () => {
      isMounted = false;
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
      style={{ width: "100%", height: "100%" }}
      controls
      loop
    />
  );
};
