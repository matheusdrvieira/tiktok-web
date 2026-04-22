"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type QuizGenerationDialogProps = {
  open: boolean;
  niche: string;
  reference: string;
};

const GENERATION_TARGET_MS = 120_000;
const GENERATION_MIN_PROGRESS = 8;
const GENERATION_MAX_PROGRESS = 95;

const GENERATION_STAGES = [
  {
    startAtMs: 0,
    title: "Analisando contexto",
    description: "A IA está entendendo o nicho e a referência do quiz.",
  },
  {
    startAtMs: 30_000,
    title: "Montando perguntas",
    description: "Criando perguntas, alternativas e respostas corretas.",
  },
  {
    startAtMs: 70_000,
    title: "Validando qualidade",
    description: "Revisando consistência, clareza e variedade do conteúdo.",
  },
  {
    startAtMs: 105_000,
    title: "Finalizando geração",
    description: "Preparando o payload para preencher a publicação.",
  },
] as const;

const getCurrentStageIndex = (elapsedMs: number): number => {
  let stageIndex = 0;

  for (let index = 0; index < GENERATION_STAGES.length; index += 1) {
    if (elapsedMs >= GENERATION_STAGES[index].startAtMs) {
      stageIndex = index;
    }
  }

  return stageIndex;
};

export function QuizGenerationDialog({
  open,
  niche,
  reference,
}: QuizGenerationDialogProps) {
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
    }, 180);

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
    const progressRange = GENERATION_MAX_PROGRESS - GENERATION_MIN_PROGRESS;
    const progressRatio = Math.min(1, elapsedMs / GENERATION_TARGET_MS);

    return GENERATION_MIN_PROGRESS + progressRange * progressRatio;
  }, [elapsedMs]);

  const currentStage = GENERATION_STAGES[currentStageIndex];

  return (
    <Dialog open={open}>
      <DialogContent
        className="[&>button]:hidden sm:max-w-md"
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-4 animate-pulse text-primary" />
            Gerando conteúdo com IA
          </DialogTitle>
          <DialogDescription>{currentStage.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Progress value={progressValue} />
          <p className="text-center text-xs text-muted-foreground">
            {currentStage.title}
          </p>
        </div>

        <div className="rounded-md border border-border bg-secondary/40 p-3 text-xs text-muted-foreground">
          <p>
            Nicho: <span className="text-foreground">{niche || "-"}</span>
          </p>
          <p>
            Referência: <span className="text-foreground">{reference || "-"}</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
