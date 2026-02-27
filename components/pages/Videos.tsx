"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useIntegrationsService } from "@/services/integrationsService";
import { useTikTokService } from "@/services/tiktokService";
import { useYoutubeService } from "@/services/youtubeService";
import { useVideosService } from "@/services/videosService";
import { IntegrationProvider } from "@/types/integrations";
import { VideoStatusEnum, type VideoOutput } from "@/types/videos";
import { formatRenderedAt } from "@/utils/format-rendered-at";
import { formatDuration, formatSize } from "@/utils/format-video-metadata";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  Download,
  Film,
  Globe2,
  Loader2,
  Music2,
  Send,
  Youtube,
} from "lucide-react";
import { useMemo, useState } from "react";

const PLATFORM_LABELS: Record<IntegrationProvider, string> = {
  [IntegrationProvider.TIKTOK]: "TikTok",
  [IntegrationProvider.YOUTUBE]: "YouTube",
};

const PUBLISH_PROVIDERS: IntegrationProvider[] = [
  IntegrationProvider.TIKTOK,
  IntegrationProvider.YOUTUBE,
];

export default function Videos() {
  const { toast } = useToast();
  const [selectedVideo, setSelectedVideo] = useState<VideoOutput | null>(null);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const { getIntegrations: { data: integrations } } = useIntegrationsService();
  const { publishTikTok } = useTikTokService();
  const { uploadYoutube } = useYoutubeService();
  const {
    listVideos: { data, isLoading: isLoadingVideos },
  } = useVideosService();

  const activeProviders = useMemo(
    () =>
      new Set(
        (integrations ?? [])
          .filter((integration) => integration.isActive)
          .map((integration) => integration.provider),
      ),
    [integrations],
  );
  const isPublishingAny = publishTikTok.isPending || uploadYoutube.isPending;
  const canPublishAll =
    activeProviders.has(IntegrationProvider.TIKTOK) &&
    activeProviders.has(IntegrationProvider.YOUTUBE);

  const getPublishTitle = (video: VideoOutput) => {
    const hashtagsText = video.hashtags.join(" ").trim();
    return hashtagsText ? `${video.title}\n${hashtagsText}` : video.title;
  };

  const handleOpenPublishDialog = (video: VideoOutput) => {
    if (!video.url) {
      toast({
        title: "Vídeo indisponível",
        description: "Renderize o vídeo antes de publicar.",
        variant: "destructive",
      });
      return;
    }

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setSelectedVideo(video);
    setIsPublishDialogOpen(true);
  };

  const handlePublish = async (provider: IntegrationProvider) => {
    if (!selectedVideo?.url) {
      return;
    }

    if (!activeProviders.has(provider)) {
      toast({
        title: "Integração desconectada",
        description: `Conecte ${PLATFORM_LABELS[provider]} em Integrações para publicar.`,
        variant: "destructive",
      });
      return;
    }

    try {
      const publishTitle = getPublishTitle(selectedVideo);

      if (provider === IntegrationProvider.TIKTOK) {
        const { publishId } = await publishTikTok.mutateAsync({
          videoId: selectedVideo.id,
          title: publishTitle,
          videoPath: selectedVideo.url,
        });

        toast({
          title: "Publicação enviada",
          description: `TikTok ID: ${publishId ?? "-"}`,
        });
      } else if (provider === IntegrationProvider.YOUTUBE) {
        const { videoId } = await uploadYoutube.mutateAsync({
          videoId: selectedVideo.id,
          title: publishTitle,
          videoPath: selectedVideo.url,
        });

        toast({
          title: "Upload enviado",
          description: `YouTube ID: ${videoId}`,
        });
      }

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

  const handlePublishAll = async () => {
    if (!selectedVideo?.url) {
      return;
    }

    if (!canPublishAll) {
      toast({
        title: "Integrações desconectadas",
        description: "Conecte TikTok e YouTube em Integrações para publicar nas duas plataformas.",
        variant: "destructive",
      });
      return;
    }

    const publishTitle = getPublishTitle(selectedVideo);

    const [tiktokResult, youtubeResult] = await Promise.allSettled([
      publishTikTok.mutateAsync({
        videoId: selectedVideo.id,
        title: publishTitle,
        videoPath: selectedVideo.url,
      }),
      uploadYoutube.mutateAsync({
        videoId: selectedVideo.id,
        title: publishTitle,
        videoPath: selectedVideo.url,
      }),
    ]);

    const tiktokOk = tiktokResult.status === "fulfilled";
    const youtubeOk = youtubeResult.status === "fulfilled";

    if (tiktokOk && youtubeOk) {
      toast({
        title: "Publicações enviadas",
        description: `TikTok ID: ${tiktokResult.value.publishId ?? "-"} · YouTube ID: ${youtubeResult.value.videoId}`,
      });
      setIsPublishDialogOpen(false);
      setSelectedVideo(null);
      return;
    }

    if (tiktokOk || youtubeOk) {
      toast({
        title: "Publicação parcial",
        description: `${tiktokOk ? "TikTok enviado" : "TikTok falhou"} · ${youtubeOk ? "YouTube enviado" : "YouTube falhou"}`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Erro ao publicar",
      description: "Não foi possível publicar o vídeo nas plataformas selecionadas.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Vídeos</h1>
        <p className="text-sm text-muted-foreground">
          Todos os vídeos gerados e prontos para publicação
        </p>
      </div>

      {isLoadingVideos ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="aspect-video w-full" />
        </div>
      ) : data?.length === 0 ? (
        <Card className="card-blur">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Nenhum vídeo renderizado encontrado para este usuário.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((video) => {
            const isPublished = video.status === VideoStatusEnum.PUBLISHED;
            const isRendered = video.status === VideoStatusEnum.RENDERED;
            return (
              <Card key={video.id} className="card-blur overflow-hidden">
                {video.url ? (
                  <video
                    controls
                    preload="metadata"
                    className="aspect-video w-full border-b border-border bg-black/40"
                    src={video.url}
                  />
                ) : (
                  <div className="flex aspect-video items-center justify-center border-b border-border bg-secondary/50">
                    <Film className="size-8 text-muted-foreground/40" />
                  </div>
                )}
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-medium">{video?.title}</p>
                    {isPublished ? (
                      <Badge className="shrink-0 border-sky-500/30 bg-sky-500/20 text-xs text-sky-400 hover:bg-sky-500/20 hover:text-sky-400">
                        <CheckCircle2 className="mr-1 size-3" />
                        Publicado
                      </Badge>
                    ) : isRendered ? (
                      <Badge className="shrink-0 border-emerald-500/30 bg-emerald-500/20 text-xs text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-400">
                        <CheckCircle2 className="mr-1 size-3" />
                        Renderizado
                      </Badge>
                    ) : (
                      <Badge className="shrink-0 border-amber-500/30 bg-amber-500/20 text-xs text-amber-400 hover:bg-amber-500/20 hover:text-amber-400">
                        <Clock className="mr-1 size-3" />
                        Rascunho
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{formatDuration(video.duration)}</span>
                    <span>·</span>
                    <span>{formatSize(video.size)}</span>
                  </div>

                  <p className="text-xs text-muted-foreground">{formatRenderedAt(video.createdAt)}</p>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenPublishDialog(video)}
                      disabled={!video.url}
                    >
                      <Send className="mr-1.5 size-4" />
                      Publicar
                    </Button>

                    {video.url ? (
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="flex-1 hover:bg-background hover:text-foreground hover:brightness-110"
                      >
                        <a
                          href={video.url}
                          download={`${video.title || "quiz"}.mp4`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Download className="mr-1.5 size-4" />
                          Baixar
                        </a>
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="flex-1" disabled>
                        <Download className="mr-1.5 size-4" />
                        Baixar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog
        open={isPublishDialogOpen}
        onOpenChange={(open) => {
          if (!open && isPublishingAny) {
            return;
          }

          setIsPublishDialogOpen(open);
          if (!open) {
            setSelectedVideo(null);
          }
        }}
      >
        <DialogContent
          className="border-border/70 bg-card/95 sm:max-w-lg"
          onEscapeKeyDown={(event) => {
            if (isPublishingAny) {
              event.preventDefault();
            }
          }}
          onPointerDownOutside={(event) => {
            if (isPublishingAny) {
              event.preventDefault();
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>Publicar vídeo</DialogTitle>
            <DialogDescription>
              Escolha uma plataforma específica ou publique em todas ao mesmo tempo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="rounded-lg border border-border/70 bg-background/40 p-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Vídeo selecionado
              </p>
              <p className="truncate text-sm font-medium">{selectedVideo?.title ?? "-"}</p>
              <p className="truncate text-xs text-muted-foreground">
                {(selectedVideo?.hashtags ?? []).join(" ") || "Sem hashtags"}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2">
            {PUBLISH_PROVIDERS.map((provider) => {
              const isTikTok = provider === IntegrationProvider.TIKTOK;
              const isYoutube = provider === IntegrationProvider.YOUTUBE;
              const isActive = activeProviders.has(provider);
              const isDisabled =
                isPublishingAny ||
                !isActive;
              const isPublishingCurrentProvider =
                (isTikTok && publishTikTok.isPending) ||
                (isYoutube && uploadYoutube.isPending);
              const ProviderIcon = isTikTok ? Music2 : Youtube;

              return (
                <Button
                  key={provider}
                  variant="outline"
                  className={cn(
                    "h-auto w-full justify-between rounded-xl border-border/70 bg-background/60 px-4 py-3 text-left hover:border-primary/40 hover:bg-primary/5",
                    !isActive && "opacity-70",
                  )}
                  onClick={() => handlePublish(provider)}
                  disabled={isDisabled}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full",
                        isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                      )}
                    >
                      <ProviderIcon className="size-4" />
                    </span>
                    <span className="flex flex-col items-start">
                      <span className="text-sm font-medium">{PLATFORM_LABELS[provider]}</span>
                      <span className="text-xs text-muted-foreground">
                        {isPublishingCurrentProvider
                          ? isTikTok
                            ? "Publicando no TikTok..."
                            : "Enviando para YouTube..."
                          : isActive
                            ? "Publicar somente nesta plataforma"
                            : "Integração desconectada"}
                      </span>
                    </span>
                  </span>

                  {isPublishingCurrentProvider ? (
                    <Loader2 className="size-4 animate-spin text-primary" />
                  ) : (
                    <Send className="size-4 text-muted-foreground" />
                  )}
                </Button>
              );
            })}
            </div>

            <Button
              variant="secondary"
              className="h-11 rounded-xl"
              onClick={handlePublishAll}
              disabled={isPublishingAny || !canPublishAll}
            >
              {isPublishingAny
                ? "Publicando em todas as plataformas..."
                : `Publicar em todas as plataformas${canPublishAll ? "" : " (desconectado)"}`}
              {isPublishingAny ? (
                <Loader2 className="ml-2 size-4 animate-spin" />
              ) : (
                <Globe2 className="ml-2 size-4" />
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              O modal permanece aberto enquanto o envio estiver em andamento.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
