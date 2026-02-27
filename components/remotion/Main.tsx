import type { ComponentType } from "react";
import { QuizTemplateEnum } from "./enums";
import { Main as ComicPopMain } from "./layouts/comic-pop/Main";
import { Main as NeonPulseMain } from "./layouts/neon-pulse/Main";
import { Main as SunsetWaveMain } from "./layouts/sunset-wave/Main";
import type { CompositionInputProps } from "./schemas/composition-props.schema";

const layoutByTemplateId: Record<
  QuizTemplateEnum,
  ComponentType<CompositionInputProps>
> = {
  [QuizTemplateEnum.ComicPop]: ComicPopMain,
  [QuizTemplateEnum.NeonPulse]: NeonPulseMain,
  [QuizTemplateEnum.SunsetWave]: SunsetWaveMain,
};

export default function Main(props: CompositionInputProps) {
  const templateId = (props.templateId ?? QuizTemplateEnum.ComicPop) as QuizTemplateEnum;

  const LayoutMain = layoutByTemplateId[templateId];

  return <LayoutMain {...props} templateId={templateId} />;
}
