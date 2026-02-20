"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useIntegrationsService } from "@/services/integrationsService";
import { useUserService } from "@/services/userService";
import type { IntegrationProvider, OutVideoOption } from "@/types";
import { RefreshCw, Send, Video } from "lucide-react";
import { useMemo, useState } from "react";

const PLATAFORM_CONFIG: Record<IntegrationProvider, string> = {
  TIKTOK: "TikTok",
  KWAI: "Kwai",
  YOUTUBE: "YouTube",
};

const PUBLISH_PROVIDERS: IntegrationProvider[] = ["TIKTOK", "KWAI", "YOUTUBE"];

const splitVideoName = (value: string): { title: string; hashtags: string } => {
  const normalized = value.trim();
  const lines = normalized.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  if (lines.length > 1) {
    return {
      title: lines[0] ?? normalized,
      hashtags: lines.slice(1).join(" "),
    };
  }

  const hashtags = normalized.match(/#[^\s#]+/g) ?? [];

  if (hashtags.length > 0) {
    const title = normalized.replace(/#[^\s#]+/g, "").trim();
    return {
      title: title || normalized,
      hashtags: hashtags.join(" "),
    };
  }

  return { title: normalized, hashtags: "" };
};

export default function RenderedVideos() {
  const [selectedVideo, setSelectedVideo] = useState<OutVideoOption | null>(null);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);

  const {
    publishTikTokVideo,
    getRenderedVideo: { data: renderedVideo },
    getRenderedVideos: { data, isLoading: isLoadingVideos, refetch }
  } = useUserService();

  const { getIntegrations: { data: integrations } } = useIntegrationsService();
  const { toast } = useToast();

  const activeProviders = useMemo(
    () =>
      new Set(
        (integrations ?? [])
          .filter((integration) => integration.isActive)
          .map((integration) => integration.provider),
      ),
    [integrations],
  );

  const handleOpenPublishDialog = (video: OutVideoOption) => {
    setSelectedVideo(video);
    setIsPublishDialogOpen(true);
  };

  const handlePublish = async (provider: IntegrationProvider) => {
    if (!selectedVideo?.path) {
      return;
    }

    if (!activeProviders.has(provider)) {
      toast({
        title: "Integração inativa",
        description: `Conecte ${PLATAFORM_CONFIG[provider]} em Integrações para publicar.`,
        variant: "destructive",
      });
      return;
    }

    if (provider !== "TIKTOK") {
      toast({
        title: "Em breve",
        description: `${PLATAFORM_CONFIG[provider]} ainda não possui publicação direta.`,
      });
      return;
    }

    try {
      const savedVideoTitle = renderedVideo?.find(
        (video) => video.url === selectedVideo.path,
      )?.name;
      const publishTitle = savedVideoTitle || selectedVideo.name || "Quiz";

      const { publishId } = await publishTikTokVideo.mutateAsync({
        title: publishTitle,
        videoPath: selectedVideo.path,
      });

      toast({
        title: "Publicação enviada",
        description: `TikTok ID: ${publishId}`,
      });

      setIsPublishDialogOpen(false);
      setSelectedVideo(null);
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
      <Card className="card-blur">
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-base">
              <Video className="size-4 text-primary" />
              Vídeos Renderizados
            </CardTitle>
            <CardDescription>
              Lista dos vídeos renderizados para a sua conta.
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => refetch()}
            disabled={isLoadingVideos}
          >
            <RefreshCw className="mr-2 size-4" />
            Atualizar
          </Button>
        </CardHeader>
      </Card>

      {isLoadingVideos ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      ) : data?.length === 0 ? (
        <Card className="card-blur">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Nenhum vídeo renderizado encontrado para este usuário.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {data?.map((video) => {
            const parsedVideoName = splitVideoName(video.name);

            return (
              <Card key={video.path} className="card-blur overflow-hidden">
                <CardHeader className="space-y-1 pb-2">
                  <CardTitle className="truncate text-sm">{parsedVideoName.title}</CardTitle>
                  {parsedVideoName.hashtags ? (
                    <p className="truncate text-xs text-muted-foreground">
                      {parsedVideoName.hashtags}
                    </p>
                  ) : null}
                </CardHeader>
                <CardContent className="space-y-3">
                  <video
                    controls
                    preload="metadata"
                    className="aspect-video w-full rounded-md border border-border bg-black/40"
                    src={video.path}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => handleOpenPublishDialog(video)}>
                      <Send className="mr-2 size-4" />
                      Publicar
                    </Button>
                    <Button size="sm" asChild className="flex-1">
                      <a href={video.path} download={video.name}>
                        Baixar
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog
        open={isPublishDialogOpen}
        onOpenChange={(open) => {
          setIsPublishDialogOpen(open);
          if (!open) {
            setSelectedVideo(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escolha a plataforma</DialogTitle>
            <DialogDescription>
              Selecione onde deseja publicar o vídeo renderizado.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-2">
            {PUBLISH_PROVIDERS.map((provider) => {
              const isTikTok = provider === "TIKTOK";
              const isActive = activeProviders.has(provider);
              const isDisabled = publishTikTokVideo.isPending || !isTikTok || !isActive;

              return (
                <Button
                  key={provider}
                  variant={isTikTok && isActive ? "default" : "secondary"}
                  onClick={() => handlePublish(provider)}
                  disabled={isDisabled}
                >
                  {isTikTok && isActive && publishTikTokVideo.isPending
                    ? "Publicando no TikTok..."
                    : `${PLATAFORM_CONFIG[provider]}${!isTikTok ? " (Em breve)" : !isActive ? " (inativo)" : ""}`}
                </Button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
