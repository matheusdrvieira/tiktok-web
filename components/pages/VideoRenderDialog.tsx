"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Film } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type VideoRenderDialogProps = {
  open: boolean;
};

const ESTIMATED_RENDER_DURATION_MS = 4 * 60 * 1000;

const RENDER_STAGES = [
  {
    startAtMs: 0,
    title: "Preparando renderização",
    description: "Organizando os dados do quiz para iniciar o render.",
  },
  {
    startAtMs: Math.floor(ESTIMATED_RENDER_DURATION_MS * 0.2),
    title: "Renderizando cenas",
    description: "Processando frames, textos e trilha do vídeo.",
  },
  {
    startAtMs: Math.floor(ESTIMATED_RENDER_DURATION_MS * 0.55),
    title: "Encodando vídeo",
    description: "Convertendo o resultado para arquivo final.",
  },
  {
    startAtMs: Math.floor(ESTIMATED_RENDER_DURATION_MS * 0.82),
    title: "Finalizando arquivo",
    description: "Conferindo resultado e concluindo o processo.",
  },
] as const;

const getCurrentStageIndex = (elapsedMs: number): number => {
  let stageIndex = 0;

  for (let index = 0; index < RENDER_STAGES.length; index += 1) {
    if (elapsedMs >= RENDER_STAGES[index].startAtMs) {
      stageIndex = index;
    }
  }

  return stageIndex;
};

export function VideoRenderDialog({ open }: VideoRenderDialogProps) {
  const [startedAtMs, setStartedAtMs] = useState<number | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (!open) {
      const resetTimeoutId = window.setTimeout(() => {
        setStartedAtMs(null);
      }, 0);

      return () => {
        window.clearTimeout(resetTimeoutId);
      };
    }

    const startedAt = Date.now();
    const startTimeoutId = window.setTimeout(() => {
      setStartedAtMs(startedAt);
      setNowMs(startedAt);
    }, 0);

    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 250);

    return () => {
      window.clearTimeout(startTimeoutId);
      window.clearInterval(intervalId);
    };
  }, [open]);

  const elapsedMs =
    open && startedAtMs ? nowMs - startedAtMs : 0;

  const currentStageIndex = useMemo(
    () => getCurrentStageIndex(elapsedMs),
    [elapsedMs],
  );

  const progressValue = useMemo(() => {
    const normalized = Math.min(1, elapsedMs / ESTIMATED_RENDER_DURATION_MS);
    const value = 8 + normalized * 86;
    return Math.min(95, value);
  }, [elapsedMs]);

  const currentStage = RENDER_STAGES[currentStageIndex];

  return (
    <Dialog open={open}>
      <DialogContent
        className="[&>button]:hidden sm:max-w-md"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Film className="size-4 animate-pulse text-primary" />
            Pré-renderizando vídeo...
          </DialogTitle>
          <DialogDescription>{currentStage.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Progress value={progressValue} />
          <p className="text-center text-xs text-muted-foreground">
            {currentStage.title}
          </p>
          <p className="text-center text-xs text-muted-foreground">
            {Math.min(Math.round(progressValue), 100)}%
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
