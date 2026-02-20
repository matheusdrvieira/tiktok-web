"use client";

import {
  DEFAULT_QUIZ_CONTENT
} from "@/components/remotion/constants";
import { RemotionPreview } from "@/components/remotion/RemotionPreview";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuthService } from "@/services/authService";
import { useIntegrationsService } from "@/services/integrationsService";
import { useUserService } from "@/services/userService";
import type {
  GeneratedQuizVideoResponse,
  IntegrationProvider,
  Platform
} from "@/types";
import { Film, Play, Send, Sparkles, User, Wifi } from "lucide-react";
import { useMemo, useState } from "react";

const PLATFORM_CONFIG: Record<Platform, { label: string; provider: IntegrationProvider }> = {
  tiktok: { label: "TikTok", provider: "TIKTOK" },
  kwai: { label: "Kwai", provider: "KWAI" },
  youtube: { label: "YouTube", provider: "YOUTUBE" },
};

const getPlatformFromProvider = (provider: IntegrationProvider): Platform | null => {
  for (const platform of Object.keys(PLATFORM_CONFIG) as Platform[]) {
    if (PLATFORM_CONFIG[platform].provider === provider) {
      return platform;
    }
  }

  return null;
};

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export default function Dashboard() {
  const { getSession: { data: { user } } } = useAuthService();
  const { getIntegrations: { data: integrations } } = useIntegrationsService();
  const {
    getCreatorInfo: { data: creatorInfo },
    generateQuizVideo,
    startPreRenderVideoJob,
    getPreRenderVideoJob,
    publishTikTokVideo
  } = useUserService();

  const { toast } = useToast();
  const activeIntegration = integrations?.find(
    (integration) => integration.isActive === true,
  );
  const activeProvider: Platform | null = activeIntegration
    ? getPlatformFromProvider(activeIntegration.provider)
    : null;
  const activePlatformLabel = activeProvider
    ? PLATFORM_CONFIG[activeProvider].label
    : "uma plataforma";

  const integrationsCount = integrations?.filter(
    (integration) => integration.isActive === true,
  ).length ?? 0;

  const isConnected = activeProvider
    ? integrations?.some(
      (integration) =>
        integration.provider === PLATFORM_CONFIG[activeProvider].provider &&
        integration.isActive === true,
    ) ?? false
    : false;

  const [videoPath, setVideoPath] = useState('');
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStatusMessage, setRenderStatusMessage] = useState("Aguardando...");
  const [quiz, setQuiz] = useState<GeneratedQuizVideoResponse | null>(null);

  const preview = useMemo(
    () => ({
      title: quiz
        ? quiz.title
        : DEFAULT_QUIZ_CONTENT.title,
      questions: quiz
        ? quiz.questions
        : DEFAULT_QUIZ_CONTENT.questions,
    }),
    [quiz],
  );

  const handleGenerate = async () => {
    try {
      const quizPayload = await generateQuizVideo.mutateAsync();
      setQuiz(quizPayload);
      toast({ title: "Conteúdo gerado", description: "Preview atualizado com sucesso." });
    } catch {
      toast({
        title: "Erro ao gerar conteúdo",
        description: "Não foi possível gerar o conteúdo do vídeo.",
        variant: "destructive",
      });
    }
  };

  const handlePreRender = async () => {
    if (isRendering || startPreRenderVideoJob.isPending) return;

    setIsRendering(true);
    setRenderProgress(1);
    setRenderStatusMessage("Criando job de renderização...");

    try {
      const { jobId } = await startPreRenderVideoJob.mutateAsync({
        title: preview.title,
        questions: preview.questions,
      });

      while (true) {
        const job = await getPreRenderVideoJob.mutateAsync(jobId);
        setRenderProgress(job.progress);
        setRenderStatusMessage(job.message ?? "Processando...");

        if (job.status === "done") {
          if (job.video?.path) {
            setVideoPath(job.video.path);
          }

          toast({
            title: "Vídeo pronto",
            description: "Pré-renderização concluída.",
          });

          break;
        }

        if (job.status === "error") {
          throw new Error(job.message ?? "Não foi possível renderizar o vídeo.");
        }

        await sleep(1000);
      }

      setIsRendering(false);
    } catch {
      setIsRendering(false);
      toast({
        title: "Erro ao pre-renderizar",
        description: "Não foi possível renderizar o vídeo.",
        variant: "destructive",
      });
    }
  };

  const handlePublish = async () => {
    try {
      const { publishId } = await publishTikTokVideo.mutateAsync({
        title: preview.title,
        videoPath: videoPath,
      });

      toast({ title: "Publicação enviada", description: `ID: ${publishId}` });
    } catch {
      toast({
        title: "Erro ao publicar",
        description: "Não foi possível publicar o vídeo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Row 1: Account Overview */}
      <div className="grid grid-cols-1 gap-6">
        {/* Account Overview */}
        <Card className="card-blur">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="size-4 text-primary" />
              Account Overview
            </CardTitle>
            <div className="sm:text-right">
              <div className="flex items-center gap-2 text-base font-semibold sm:justify-end">
                <Wifi className="size-4 text-primary" />
                Integrações ativas:
                <Badge
                  variant={integrationsCount > 0 ? "default" : "secondary"}
                  className={
                    integrationsCount > 0
                      ? "border-primary/30 bg-primary/20 text-primary hover:bg-primary/20 hover:text-primary"
                      : ""
                  }
                >
                  {integrationsCount > 0
                    ? `${integrationsCount} ativa${integrationsCount === 1 ? "" : "s"}`
                    : "Nenhuma ativa"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="flex items-start gap-4">
                <Avatar className="size-12">
                  <AvatarImage src={creatorInfo?.creatorAvatarUrl} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {creatorInfo?.creatorNickname.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-sm min-w-0">
                  <p className="font-medium">{creatorInfo?.creatorNickname}</p>
                  <p className="text-muted-foreground truncate">{user?.email ?? "-"}</p>
                  <div className="pt-2 space-y-1 text-muted-foreground">
                    <p><span className="text-foreground/70">Canal:</span> {`@${creatorInfo?.creatorUsername}`}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Preview + Publish */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Preview */}
        <Card className="card-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Play className="size-4 text-primary" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mx-auto w-full max-w-60 aspect-9/16 rounded-lg bg-secondary/50 border border-border overflow-hidden">
              <RemotionPreview inputProps={preview} />
            </div>
          </CardContent>
        </Card>

        {/* Publish Form */}
        <Card className="card-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Send className="size-4 text-primary" />
              Publicação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Textarea
                value={preview.title}
                readOnly
                rows={2}
                placeholder={"Geography\n#geography #quiz #foryou"}
              />
              <p className="text-xs text-muted-foreground">Linha 1: título. Linha 2: hashtags para postagem.</p>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-2 sm:grid-cols-3">
              {isConnected ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="w-full"
                      disabled={publishTikTokVideo.isPending}
                    >
                      <Send className="mr-2 size-4" />
                      {publishTikTokVideo.isPending
                        ? "Publicando..."
                        : "Publicar"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar publicação</AlertDialogTitle>
                      <AlertDialogDescription>
                        Publicar este vídeo em {activePlatformLabel}?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        disabled={publishTikTokVideo.isPending}
                        onClick={handlePublish}
                      >
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button
                  className="w-full"
                  disabled
                  onClick={() =>
                    toast({
                      title: `Conecte ${activePlatformLabel} em Integrações para publicar.`,
                      variant: "destructive",
                    })
                  }
                >
                  <Send className="mr-2 size-4" />
                  Publicar
                </Button>
              )}
              <Button
                className="w-full"
                variant="secondary"
                onClick={handleGenerate}
                disabled={generateQuizVideo.isPending}
              >
                <Sparkles className="mr-2 size-4" />
                {generateQuizVideo.isPending
                  ? "Gerando..."
                  : "Gerar conteúdo"}
              </Button>
              <Button
                className="w-full"
                variant="secondary"
                onClick={handlePreRender}
                disabled={isRendering || startPreRenderVideoJob.isPending}
              >
                <Film className="mr-2 size-4" />
                {isRendering || startPreRenderVideoJob.isPending
                  ? "Renderizando..."
                  : "Pre-renderizar"}
              </Button>
            </div>

            {!isConnected && (
              <p className="text-xs text-primary/80">
                Conecte {activePlatformLabel} em Integrações para habilitar a publicação.
              </p>
            )}

            {videoPath ? (
              <p className="text-xs text-muted-foreground break-all">
                Vídeo pre-renderizado atual: {videoPath}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Gere o conteúdo e clique em pre-renderizar para liberar a publicação.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pre-render Dialog */}
      <Dialog open={isRendering} onOpenChange={setIsRendering}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pré-renderizando vídeo...</DialogTitle>
          </DialogHeader>
          <Progress value={Math.min(renderProgress, 100)} className="mt-4" />
          <p className="text-sm text-muted-foreground text-center">
            {Math.min(Math.round(renderProgress), 100)}%
          </p>
          <p className="text-xs text-muted-foreground text-center">
            {renderStatusMessage}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
