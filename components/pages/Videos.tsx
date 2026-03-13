"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useIntegrationsService } from "@/services/integrationsService";
import { useTikTokService } from "@/services/tiktokService";
import { useVideosService } from "@/services/videosService";
import { useYoutubeService } from "@/services/youtubeService";
import { IntegrationProvider } from "@/types/integrations";
import type { TikTokCreatorInfoOutput, TikTokPrivacyLevel } from "@/types/tiktok";
import { VideoStatusEnum, type VideoOutput } from "@/types/videos";
import { formatRenderedAt } from "@/utils/format-rendered-at";
import { formatDuration, formatSize } from "@/utils/format-video-metadata";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  Clock,
  Download,
  Film,
  Loader2,
  Music2,
  Send,
  Youtube,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const PLATFORM_LABELS: Record<IntegrationProvider, string> = {
  [IntegrationProvider.TIKTOK]: "TikTok",
  [IntegrationProvider.YOUTUBE]: "YouTube",
};

const PUBLISH_TABS: IntegrationProvider[] = [
  IntegrationProvider.TIKTOK,
  IntegrationProvider.YOUTUBE,
];

const TIKTOK_CAPTION_MAX_LENGTH = 2200;
const TIKTOK_PRIVACY_LEVEL_VALUES = [
  "PUBLIC_TO_EVERYONE",
  "MUTUAL_FOLLOW_FRIENDS",
  "FOLLOWER_OF_CREATOR",
  "SELF_ONLY",
] as const satisfies readonly TikTokPrivacyLevel[];

const TIKTOK_PRIVACY_LEVEL_LABELS: Record<TikTokPrivacyLevel, string> = {
  PUBLIC_TO_EVERYONE: "Público",
  MUTUAL_FOLLOW_FRIENDS: "Amigos em comum",
  FOLLOWER_OF_CREATOR: "Seguidores",
  SELF_ONLY: "Somente eu",
};
const TIKTOK_BRANDED_CONTENT_POLICY_URL = "https://www.tiktok.com/legal/bc-policy?lang=en";
const TIKTOK_MUSIC_USAGE_CONFIRMATION_URL =
  "https://www.tiktok.com/legal/page/global/music-usage-confirmation/en";
const COMMERCIAL_DISCLOSURE_REQUIRED_MESSAGE =
  "Você precisa indicar se o seu conteúdo promove você, terceiros ou ambos.";
const BRANDED_CONTENT_PRIVATE_VISIBILITY_MESSAGE =
  "A visibilidade do conteúdo de marca não pode ser privada.";
const TIKTOK_PROCESSING_NOTICE =
  "Depois da publicação, o conteúdo pode levar alguns minutos para ser processado e aparecer no seu perfil.";
const DISCLOSURE_TOGGLE_DESCRIPTION =
  "Ative para informar que este vídeo promove bens ou serviços em troca de algo de valor. O vídeo pode promover você, terceiros ou ambos.";
const DISCLOSURE_LOCKED_LABEL_NOTE =
  "Esse rótulo não poderá ser alterado depois que o vídeo for publicado.";
const BRAND_ORGANIC_DESCRIPTION =
  "Você está promovendo você ou o seu próprio negócio. Este vídeo será classificado como Conteúdo Orgânico de Marca.";
const BRAND_CONTENT_DESCRIPTION =
  "Você está promovendo outra marca ou um terceiro. Este vídeo será classificado como Conteúdo de Marca.";

const publishFormSchema = z.object({
  tiktokCaption: z
    .string()
    .trim()
    .min(1, "Informe a legenda do vídeo para publicar no TikTok.")
    .max(TIKTOK_CAPTION_MAX_LENGTH, `A legenda do TikTok deve ter no máximo ${TIKTOK_CAPTION_MAX_LENGTH} caracteres.`),
  youtubeTitle: z.string().trim().min(1, "Informe o título para enviar o vídeo ao YouTube."),
  privacyLevel: z.enum(TIKTOK_PRIVACY_LEVEL_VALUES).nullable(),
  allowComment: z.boolean(),
  allowDuet: z.boolean(),
  allowStitch: z.boolean(),
  contentDisclosureEnabled: z.boolean(),
  brandOrganicToggle: z.boolean(),
  brandContentToggle: z.boolean(),
  contentDisclosureAccepted: z.boolean(),
});

type PublishFormValues = z.infer<typeof publishFormSchema>;

const defaultPublishFormValues: PublishFormValues = {
  tiktokCaption: "",
  youtubeTitle: "",
  privacyLevel: null,
  allowComment: false,
  allowDuet: false,
  allowStitch: false,
  contentDisclosureEnabled: false,
  brandOrganicToggle: false,
  brandContentToggle: false,
  contentDisclosureAccepted: false,
};

export default function Videos() {
  const { toast } = useToast();
  const [selectedVideo, setSelectedVideo] = useState<VideoOutput | null>(null);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [activePublishTab, setActivePublishTab] = useState<IntegrationProvider>(
    IntegrationProvider.TIKTOK,
  );
  const publishForm = useForm<PublishFormValues>({
    resolver: zodResolver(publishFormSchema),
    defaultValues: defaultPublishFormValues,
  });

  const {
    getIntegrations: { data: integrations },
  } = useIntegrationsService();
  const { publishTikTok, getCreatorInfo } = useTikTokService();
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
  const tikTokCreatorInfo = getCreatorInfo.data;
  const isTikTokConnected = activeProviders.has(IntegrationProvider.TIKTOK);
  const isYoutubeConnected = activeProviders.has(IntegrationProvider.YOUTUBE);
  const watchedTikTokCaption =
    useWatch({ control: publishForm.control, name: "tiktokCaption" }) ?? "";
  const watchedYoutubeTitle =
    useWatch({ control: publishForm.control, name: "youtubeTitle" }) ?? "";
  const watchedPrivacyLevel =
    useWatch({ control: publishForm.control, name: "privacyLevel" }) ?? null;
  const watchedAllowComment =
    useWatch({ control: publishForm.control, name: "allowComment" }) ?? false;
  const watchedAllowDuet =
    useWatch({ control: publishForm.control, name: "allowDuet" }) ?? false;
  const watchedAllowStitch =
    useWatch({ control: publishForm.control, name: "allowStitch" }) ?? false;
  const watchedContentDisclosureEnabled =
    useWatch({ control: publishForm.control, name: "contentDisclosureEnabled" }) ?? false;
  const watchedBrandOrganicToggle =
    useWatch({ control: publishForm.control, name: "brandOrganicToggle" }) ?? false;
  const watchedBrandContentToggle =
    useWatch({ control: publishForm.control, name: "brandContentToggle" }) ?? false;
  const watchedContentDisclosureAccepted =
    useWatch({ control: publishForm.control, name: "contentDisclosureAccepted" }) ?? false;
  const hasBrandOrganicDisclosure =
    watchedContentDisclosureEnabled && watchedBrandOrganicToggle;
  const hasBrandContentDisclosure =
    watchedContentDisclosureEnabled && watchedBrandContentToggle;
  const disclosureSelectionReady =
    !watchedContentDisclosureEnabled || hasBrandOrganicDisclosure || hasBrandContentDisclosure;
  const requiresBrandedContentTerms = hasBrandContentDisclosure;
  const disclosureLabelMessage = hasBrandContentDisclosure
    ? "Sua foto/vídeo será rotulado como \"Parceria paga\"."
    : hasBrandOrganicDisclosure
      ? "Sua foto/vídeo será rotulado como \"Conteúdo promocional\"."
      : null;
  const showDisclosureSummary =
    watchedContentDisclosureEnabled && disclosureSelectionReady && Boolean(disclosureLabelMessage);
  const isPrivateVisibilitySelected = watchedPrivacyLevel === "SELF_ONLY";
  const areInteractionsBlockedByPrivacy = isPrivateVisibilitySelected;
  const isBrandedContentBlockedByPrivateVisibility =
    watchedContentDisclosureEnabled && isPrivateVisibilitySelected;
  const showDisclosureSelectionTooltip =
    activePublishTab === IntegrationProvider.TIKTOK &&
    watchedContentDisclosureEnabled &&
    !disclosureSelectionReady;
  const showPrivateVisibilityTooltip =
    watchedContentDisclosureEnabled && isPrivateVisibilitySelected;

  const isVideoDurationAboveTikTokLimit = useMemo(() => {
    if (
      typeof selectedVideo?.duration !== "number" ||
      !Number.isFinite(selectedVideo.duration) ||
      !tikTokCreatorInfo?.maxVideoPostDurationSec
    ) {
      return false;
    }

    return selectedVideo.duration > tikTokCreatorInfo.maxVideoPostDurationSec;
  }, [selectedVideo?.duration, tikTokCreatorInfo?.maxVideoPostDurationSec]);

  const getPublishTitle = (video: VideoOutput) => {
    const hashtagsText = video.hashtags.join(" ").trim();
    return hashtagsText ? `${video.title}\n${hashtagsText}` : video.title;
  };

  const formatSecondsToMinutes = (seconds?: number): string => {
    if (typeof seconds !== "number" || !Number.isFinite(seconds) || seconds < 0) {
      return "0 min";
    }

    const minutes = seconds / 60;
    const maximumFractionDigits = Number.isInteger(minutes) ? 0 : 1;
    const value = new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits,
    }).format(minutes);

    return `${value} min`;
  };

  const fetchTikTokCreatorInfo = async (
    options?: { showErrorToast?: boolean },
  ): Promise<TikTokCreatorInfoOutput | undefined> => {
    const response = await getCreatorInfo.refetch();

    if (!response.data) {
      if (options?.showErrorToast ?? true) {
        toast({
          title: "Erro ao carregar conta TikTok",
          description: "Não foi possível buscar as opções de publicação do criador.",
          variant: "destructive",
        });
      }
      return undefined;
    }

    console.log("TikTok Creator Info:", response.data);


    return response.data;
  };

  useEffect(() => {
    if (
      !watchedContentDisclosureEnabled ||
      watchedPrivacyLevel !== "SELF_ONLY" ||
      !watchedBrandContentToggle
    ) {
      return;
    }

    publishForm.setValue("brandContentToggle", false, { shouldDirty: true });
    publishForm.setValue("contentDisclosureAccepted", false, { shouldDirty: true });
  }, [
    publishForm,
    watchedBrandContentToggle,
    watchedContentDisclosureEnabled,
    watchedPrivacyLevel,
  ]);

  useEffect(() => {
    if (!areInteractionsBlockedByPrivacy) {
      return;
    }

    publishForm.setValue("allowComment", false, { shouldDirty: true });
    publishForm.setValue("allowDuet", false, { shouldDirty: true });
    publishForm.setValue("allowStitch", false, { shouldDirty: true });
  }, [areInteractionsBlockedByPrivacy, publishForm]);

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

    const defaultTitle = getPublishTitle(video);
    const defaultTab = isTikTokConnected
      ? IntegrationProvider.TIKTOK
      : IntegrationProvider.YOUTUBE;

    setSelectedVideo(video);
    setIsPublishDialogOpen(true);
    setActivePublishTab(defaultTab);
    publishForm.reset({
      ...defaultPublishFormValues,
      tiktokCaption: defaultTitle.slice(0, TIKTOK_CAPTION_MAX_LENGTH),
      youtubeTitle: defaultTitle,
    });

    if (isTikTokConnected) {
      void fetchTikTokCreatorInfo({ showErrorToast: true });
    }
  };

  const handlePublishTikTok = async () => {
    if (!selectedVideo?.url) {
      return;
    }

    if (!isTikTokConnected) {
      toast({
        title: "Integração desconectada",
        description: `Conecte ${PLATFORM_LABELS[IntegrationProvider.TIKTOK]} em Integrações para publicar.`,
        variant: "destructive",
      });
      return;
    }

    const isTikTokFormValid = await publishForm.trigger("tiktokCaption");
    if (!isTikTokFormValid) {
      toast({
        title: "Legenda inválida",
        description:
          publishForm.formState.errors.tiktokCaption?.message ??
          "Informe a legenda do vídeo para publicar no TikTok.",
        variant: "destructive",
      });
      return;
    }

    const values = publishForm.getValues();
    const caption = values.tiktokCaption.trim();
    const privacyLevel = values.privacyLevel;

    if (!privacyLevel) {
      toast({
        title: "Privacidade obrigatória",
        description: "Selecione quem pode assistir ao vídeo no TikTok.",
        variant: "destructive",
      });
      return;
    }

    if (
      values.contentDisclosureEnabled &&
      !values.brandOrganicToggle &&
      !values.brandContentToggle
    ) {
      toast({
        title: "Divulgação incompleta",
        description: COMMERCIAL_DISCLOSURE_REQUIRED_MESSAGE,
        variant: "destructive",
      });
      return;
    }

    if (!values.contentDisclosureAccepted) {
      toast({
        title: "Confirmação obrigatória",
        description: "Confirme as opções de conteúdo antes de publicar no TikTok.",
        variant: "destructive",
      });
      return;
    }

    let creatorInfo = tikTokCreatorInfo;
    if (!creatorInfo) {
      creatorInfo = await fetchTikTokCreatorInfo({ showErrorToast: true });
    }

    if (!creatorInfo) {
      return;
    }

    if (!creatorInfo.canPost) {
      toast({
        title: "Publicação indisponível no momento",
        description:
          creatorInfo.canPostErrorMessage ??
          "Sua conta não pode publicar agora. Tente novamente mais tarde.",
        variant: "destructive",
      });
      return;
    }

    if (!creatorInfo.privacyLevelOptions.includes(privacyLevel)) {
      toast({
        title: "Privacidade indisponível",
        description: "Escolha uma opção de privacidade válida para esta conta TikTok.",
        variant: "destructive",
      });
      return;
    }

    if (isVideoDurationAboveTikTokLimit) {
      toast({
        title: "Vídeo acima do limite",
        description: `Sua conta permite até ${formatSecondsToMinutes(creatorInfo.maxVideoPostDurationSec)} por vídeo no TikTok.`,
        variant: "destructive",
      });
      return;
    }

    try {
      const { publishId } = await publishTikTok.mutateAsync({
        videoId: selectedVideo.id,
        title: caption,
        videoPath: selectedVideo.url,
        privacyLevel,
        disableComment: creatorInfo.commentDisabled ? true : !values.allowComment,
        disableDuet: creatorInfo.duetDisabled ? true : !values.allowDuet,
        disableStitch: creatorInfo.stitchDisabled ? true : !values.allowStitch,
        brandContentToggle: values.contentDisclosureEnabled ? values.brandContentToggle : false,
        brandOrganicToggle: values.contentDisclosureEnabled ? values.brandOrganicToggle : false,
      });

      toast({
        title: "Publicação enviada",
        description: `TikTok ID: ${publishId ?? "-"} • ${TIKTOK_PROCESSING_NOTICE}`,
      });

      setIsPublishDialogOpen(false);
      setSelectedVideo(null);
    } catch {
      toast({
        title: "Erro ao publicar",
        description: "Não foi possível publicar o vídeo no TikTok.",
        variant: "destructive",
      });
    }
  };

  const handlePublishYoutube = async () => {
    if (!selectedVideo?.url) {
      return;
    }

    if (!isYoutubeConnected) {
      toast({
        title: "Integração desconectada",
        description: `Conecte ${PLATFORM_LABELS[IntegrationProvider.YOUTUBE]} em Integrações para publicar.`,
        variant: "destructive",
      });
      return;
    }

    const isYoutubeFormValid = await publishForm.trigger("youtubeTitle");
    if (!isYoutubeFormValid) {
      toast({
        title: "Título inválido",
        description:
          publishForm.formState.errors.youtubeTitle?.message ??
          "Informe o título para enviar o vídeo ao YouTube.",
        variant: "destructive",
      });
      return;
    }

    const title = publishForm.getValues("youtubeTitle").trim();

    try {
      const { videoId } = await uploadYoutube.mutateAsync({
        videoId: selectedVideo.id,
        title,
        videoPath: selectedVideo.url,
      });

      toast({
        title: "Upload enviado",
        description: `YouTube ID: ${videoId}`,
      });

      setIsPublishDialogOpen(false);
      setSelectedVideo(null);
    } catch {
      toast({
        title: "Erro ao publicar",
        description: "Não foi possível enviar o vídeo para o YouTube.",
        variant: "destructive",
      });
    }
  };

  const handlePublishActiveTab = async () => {
    if (activePublishTab === IntegrationProvider.TIKTOK) {
      await handlePublishTikTok();
      return;
    }

    await handlePublishYoutube();
  };

  const tikTokPrivacyReady = Boolean(
    watchedPrivacyLevel &&
    tikTokCreatorInfo &&
    tikTokCreatorInfo.privacyLevelOptions.includes(watchedPrivacyLevel),
  );
  const selectedPrivacyValue = tikTokPrivacyReady ? watchedPrivacyLevel : null;
  const canPublishTikTok =
    isTikTokConnected &&
    !getCreatorInfo.isFetching &&
    Boolean(tikTokCreatorInfo) &&
    tikTokCreatorInfo?.canPost !== false &&
    Boolean(watchedTikTokCaption.trim()) &&
    tikTokPrivacyReady &&
    disclosureSelectionReady &&
    watchedContentDisclosureAccepted &&
    !isVideoDurationAboveTikTokLimit;
  const canPublishYoutube = isYoutubeConnected && Boolean(watchedYoutubeTitle.trim());
  const canPublishActiveTab =
    activePublishTab === IntegrationProvider.TIKTOK
      ? canPublishTikTok
      : canPublishYoutube;

  const canEnableComment = Boolean(
    tikTokCreatorInfo && !tikTokCreatorInfo.commentDisabled && !areInteractionsBlockedByPrivacy,
  );
  const canEnableDuet = Boolean(
    tikTokCreatorInfo && !tikTokCreatorInfo.duetDisabled && !areInteractionsBlockedByPrivacy,
  );
  const canEnableStitch = Boolean(
    tikTokCreatorInfo && !tikTokCreatorInfo.stitchDisabled && !areInteractionsBlockedByPrivacy,
  );

  const creatorDisplayName =
    tikTokCreatorInfo?.creatorNickname ||
    tikTokCreatorInfo?.creatorUsername ||
    "Conta TikTok";
  const publishActionLabel =
    activePublishTab === IntegrationProvider.TIKTOK
      ? "Publicar no TikTok"
      : "Publicar no YouTube";
  const publishLoadingLabel =
    activePublishTab === IntegrationProvider.TIKTOK
      ? "Publicando no TikTok..."
      : "Enviando para YouTube...";

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
            publishForm.reset(defaultPublishFormValues);
          }
        }}
      >
        <DialogContent
          className="scrollbar-app max-h-[calc(100dvh-2rem)] overflow-y-auto border-border/70 bg-card/95 sm:max-w-xl"
          onEscapeKeyDown={(event) => {
            if (isPublishingAny) {
              event.preventDefault();
            }
          }}
          onPointerDownOutside={(event) => {
            event.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Publicar vídeo</DialogTitle>
            <DialogDescription>
              Escolha a plataforma e revise as configurações de publicação.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg border border-border/70 bg-background/40 p-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Vídeo selecionado
              </p>
              <p className="truncate text-sm font-medium">{selectedVideo?.title ?? "-"}</p>
              <p className="truncate text-xs text-muted-foreground">
                {(selectedVideo?.hashtags ?? []).join(" ") || "Sem hashtags"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {PUBLISH_TABS.map((provider) => {
                const ProviderIcon =
                  provider === IntegrationProvider.TIKTOK ? Music2 : Youtube;
                const isConnected = activeProviders.has(provider);
                const isActiveTab = activePublishTab === provider;

                return (
                  <Button
                    key={provider}
                    type="button"
                    variant="outline"
                    className={cn(
                      "h-auto justify-start rounded-xl border-border/70 bg-background/50 px-4 py-3 text-left",
                      isActiveTab && "border-primary/60 bg-primary/10 text-primary",
                    )}
                    onClick={() => {
                      setActivePublishTab(provider);

                      if (
                        provider === IntegrationProvider.TIKTOK &&
                        isConnected &&
                        !getCreatorInfo.isFetching
                      ) {
                        void fetchTikTokCreatorInfo({ showErrorToast: true });
                      }
                    }}
                    disabled={isPublishingAny}
                  >
                    <span className="flex items-center gap-2">
                      <ProviderIcon className="size-4" />
                      <span className="text-sm font-medium">{PLATFORM_LABELS[provider]}</span>
                      <span
                        className={cn(
                          "text-xs",
                          isConnected ? "text-emerald-500" : "text-muted-foreground",
                        )}
                      >
                        {isConnected ? "Conectado" : "Desconectado"}
                      </span>
                    </span>
                  </Button>
                );
              })}
            </div>

            {activePublishTab === IntegrationProvider.TIKTOK ? (
              <div className="space-y-4 rounded-xl border border-border/70 bg-background/40 p-4">
                {!isTikTokConnected ? (
                  <p className="text-sm text-muted-foreground">
                    Conecte o TikTok em Integrações para configurar e publicar.
                  </p>
                ) : (
                  <>
                    <div className="rounded-lg border border-border/60 bg-background/70 p-3">
                      {getCreatorInfo.isFetching && !tikTokCreatorInfo ? (
                        <p className="text-sm text-muted-foreground">
                          Carregando dados do criador...
                        </p>
                      ) : tikTokCreatorInfo ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="size-10">
                                <AvatarImage
                                  src={tikTokCreatorInfo.creatorAvatarUrl}
                                  alt={creatorDisplayName}
                                />
                                <AvatarFallback>
                                  {creatorDisplayName.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{creatorDisplayName}</p>
                                <p className="text-xs text-muted-foreground">
                                  @{tikTokCreatorInfo.creatorUsername}
                                </p>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Duração máxima: {formatSecondsToMinutes(tikTokCreatorInfo.maxVideoPostDurationSec)}
                            </p>
                          </div>
                          {!tikTokCreatorInfo.canPost ? (
                            <p className="text-xs text-destructive">
                              {tikTokCreatorInfo.canPostErrorMessage ??
                                "Esta conta não pode publicar no TikTok agora. Tente novamente mais tarde."}
                            </p>
                          ) : null}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Não foi possível carregar os dados do criador.
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-medium">Legenda</p>
                        <p className="text-xs text-muted-foreground">
                          {watchedTikTokCaption.length}/{TIKTOK_CAPTION_MAX_LENGTH}
                        </p>
                      </div>
                      <Textarea
                        {...publishForm.register("tiktokCaption")}
                        maxLength={TIKTOK_CAPTION_MAX_LENGTH}
                        placeholder="Adicione uma legenda para o vídeo"
                        className="min-h-24 resize-y"
                        disabled={isPublishingAny}
                      />
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Quem pode assistir</p>
                      <Controller
                        control={publishForm.control}
                        name="privacyLevel"
                        render={({ field }) => (
                          <Select
                            value={selectedPrivacyValue ?? undefined}
                            onValueChange={(value) => {
                              field.onChange(value as TikTokPrivacyLevel);
                              publishForm.setValue("contentDisclosureAccepted", false, {
                                shouldDirty: true,
                              });
                            }}
                            disabled={
                              isPublishingAny ||
                              getCreatorInfo.isFetching ||
                              !tikTokCreatorInfo?.privacyLevelOptions?.length
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a privacidade" />
                            </SelectTrigger>
                            <SelectContent>
                              {(tikTokCreatorInfo?.privacyLevelOptions ?? []).map((option) => {
                                const isPrivateOptionBlocked =
                                  option === "SELF_ONLY" && hasBrandContentDisclosure;

                                if (!isPrivateOptionBlocked) {
                                  return (
                                    <SelectItem key={option} value={option}>
                                      {TIKTOK_PRIVACY_LEVEL_LABELS[option]}
                                    </SelectItem>
                                  );
                                }

                                return (
                                  <Tooltip key={option}>
                                    <TooltipTrigger asChild>
                                      <SelectItem
                                        value={option}
                                        disabled
                                        className="data-[disabled]:pointer-events-auto"
                                      >
                                        {TIKTOK_PRIVACY_LEVEL_LABELS[option]}
                                      </SelectItem>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" align="start" sideOffset={8}>
                                      <p>{BRANDED_CONTENT_PRIVATE_VISIBILITY_MESSAGE}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {hasBrandContentDisclosure ? (
                        <p className="text-xs text-muted-foreground">
                          {BRANDED_CONTENT_PRIVATE_VISIBILITY_MESSAGE}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Permitir interações</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                        <label
                          className={cn(
                            "flex items-center gap-2",
                            !canEnableComment && "text-muted-foreground",
                          )}
                        >
                          <input
                            type="checkbox"
                            className="size-4 accent-primary"
                            checked={canEnableComment ? watchedAllowComment : false}
                            onChange={(event) =>
                              publishForm.setValue("allowComment", event.target.checked, { shouldDirty: true })
                            }
                            disabled={isPublishingAny || !canEnableComment}
                          />
                          Comentário
                        </label>

                        <label
                          className={cn(
                            "flex items-center gap-2",
                            !canEnableDuet && "text-muted-foreground",
                          )}
                        >
                          <input
                            type="checkbox"
                            className="size-4 accent-primary"
                            checked={canEnableDuet ? watchedAllowDuet : false}
                            onChange={(event) =>
                              publishForm.setValue("allowDuet", event.target.checked, { shouldDirty: true })
                            }
                            disabled={isPublishingAny || !canEnableDuet}
                          />
                          Dueto
                        </label>

                        <label
                          className={cn(
                            "flex items-center gap-2",
                            !canEnableStitch && "text-muted-foreground",
                          )}
                        >
                          <input
                            type="checkbox"
                            className="size-4 accent-primary"
                            checked={canEnableStitch ? watchedAllowStitch : false}
                            onChange={(event) =>
                              publishForm.setValue("allowStitch", event.target.checked, { shouldDirty: true })
                            }
                            disabled={isPublishingAny || !canEnableStitch}
                          />
                          Stitch
                        </label>
                      </div>
                      {areInteractionsBlockedByPrivacy ? (
                        <p className="text-xs text-muted-foreground">
                          Publicações com visibilidade "Somente eu" não permitem comentários,
                          duetos ou stitch.
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Divulgação / Conteúdo promocional</p>
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          className="size-4 accent-primary"
                          checked={watchedContentDisclosureEnabled}
                          onChange={(event) => {
                            const checked = event.target.checked;
                            publishForm.setValue("contentDisclosureEnabled", checked, { shouldDirty: true });
                            if (!checked) {
                              publishForm.setValue("brandOrganicToggle", false, { shouldDirty: true });
                              publishForm.setValue("brandContentToggle", false, { shouldDirty: true });
                            }
                            publishForm.setValue("contentDisclosureAccepted", false, { shouldDirty: true });
                          }}
                          disabled={isPublishingAny}
                        />
                        Conteúdo promocional
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {DISCLOSURE_TOGGLE_DESCRIPTION}
                      </p>

                      {watchedContentDisclosureEnabled ? (
                        <div className="space-y-2 rounded-md border border-border/60 bg-background/70 p-3">
                          {showDisclosureSummary ? (
                            <div className="rounded-md border border-sky-500/20 bg-sky-500/10 px-3 py-2">
                              <p className="text-xs font-medium text-sky-100">
                                {disclosureLabelMessage}
                              </p>
                              <p className="mt-1 text-xs text-sky-100/80">
                                {DISCLOSURE_LOCKED_LABEL_NOTE}
                              </p>
                            </div>
                          ) : null}
                          <label className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              className="size-4 accent-primary"
                              checked={watchedBrandOrganicToggle}
                              onChange={(event) => {
                                publishForm.setValue("brandOrganicToggle", event.target.checked, { shouldDirty: true });
                                publishForm.setValue("contentDisclosureAccepted", false, { shouldDirty: true });
                              }}
                              disabled={isPublishingAny}
                            />
                            Sua marca
                          </label>
                          <p className="pl-6 text-xs text-muted-foreground">
                            {BRAND_ORGANIC_DESCRIPTION}
                          </p>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex w-fit">
                                <label
                                  className={cn(
                                    "flex items-center gap-2 text-sm",
                                    isBrandedContentBlockedByPrivateVisibility &&
                                      "cursor-not-allowed text-muted-foreground",
                                  )}
                                >
                                  <input
                                    type="checkbox"
                                    className="size-4 accent-primary"
                                    checked={watchedBrandContentToggle}
                                    onChange={(event) => {
                                      publishForm.setValue("brandContentToggle", event.target.checked, {
                                        shouldDirty: true,
                                      });
                                      publishForm.setValue("contentDisclosureAccepted", false, {
                                        shouldDirty: true,
                                      });
                                    }}
                                    disabled={
                                      isPublishingAny || isBrandedContentBlockedByPrivateVisibility
                                    }
                                  />
                                  Conteúdo de marca
                                </label>
                              </span>
                            </TooltipTrigger>
                            {showPrivateVisibilityTooltip ? (
                              <TooltipContent side="top">
                                <p>{BRANDED_CONTENT_PRIVATE_VISIBILITY_MESSAGE}</p>
                              </TooltipContent>
                            ) : null}
                          </Tooltip>
                          <p className="pl-6 text-xs text-muted-foreground">
                            {BRAND_CONTENT_DESCRIPTION}
                          </p>
                          {!disclosureSelectionReady ? (
                            <p className="text-xs text-destructive">
                              {COMMERCIAL_DISCLOSURE_REQUIRED_MESSAGE}
                            </p>
                          ) : null}
                          {isBrandedContentBlockedByPrivateVisibility ? (
                            <p className="text-xs text-muted-foreground">
                              {BRANDED_CONTENT_PRIVATE_VISIBILITY_MESSAGE}
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                    </div>

                    {isVideoDurationAboveTikTokLimit && tikTokCreatorInfo ? (
                      <p className="text-xs text-destructive">
                        O vídeo tem {formatSecondsToMinutes(selectedVideo?.duration ?? 0)} e
                        ultrapassa o limite da conta (
                        {formatSecondsToMinutes(tikTokCreatorInfo.maxVideoPostDurationSec)}).
                      </p>
                    ) : null}

                    <div className="flex items-start gap-2 text-sm">
                      <input
                        id="tiktok-compliance-consent"
                        type="checkbox"
                        className="mt-0.5 size-4 accent-primary"
                        checked={watchedContentDisclosureAccepted}
                        onChange={(event) =>
                          publishForm.setValue("contentDisclosureAccepted", event.target.checked, { shouldDirty: true })
                        }
                        disabled={isPublishingAny}
                      />
                      <div className="space-y-1">
                        <label
                          htmlFor="tiktok-compliance-consent"
                          className="text-muted-foreground"
                        >
                          Confirmo que revisei as configurações de privacidade, interações e
                          conteúdo conforme as regras do TikTok antes de publicar.
                        </label>
                        <p className="text-muted-foreground">
                          {requiresBrandedContentTerms ? (
                            <>
                              Ao publicar, você concorda com a{" "}
                              <a
                                href={TIKTOK_BRANDED_CONTENT_POLICY_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="underline underline-offset-2 hover:text-foreground"
                              >
                                Política de Conteúdo de Marca do TikTok
                              </a>{" "}
                              e com a{" "}
                              <a
                                href={TIKTOK_MUSIC_USAGE_CONFIRMATION_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="underline underline-offset-2 hover:text-foreground"
                              >
                                Confirmação de Uso de Música do TikTok
                              </a>
                              .
                            </>
                          ) : (
                            <>
                              Ao publicar, você concorda com a{" "}
                              <a
                                href={TIKTOK_MUSIC_USAGE_CONFIRMATION_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="underline underline-offset-2 hover:text-foreground"
                              >
                                Confirmação de Uso de Música do TikTok
                              </a>
                              .
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4 rounded-xl border border-border/70 bg-background/40 p-4">
                {!isYoutubeConnected ? (
                  <p className="text-sm text-muted-foreground">
                    Conecte o YouTube em Integrações para publicar.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Título</p>
                    <Textarea
                      {...publishForm.register("youtubeTitle")}
                      placeholder="Título para upload no YouTube"
                      className="min-h-24 resize-y"
                      disabled={isPublishingAny}
                    />
                  </div>
                )}
              </div>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className="block"
                  title={showDisclosureSelectionTooltip ? COMMERCIAL_DISCLOSURE_REQUIRED_MESSAGE : undefined}
                >
                  <Button
                    className="h-11 w-full rounded-xl"
                    onClick={handlePublishActiveTab}
                    disabled={isPublishingAny || !canPublishActiveTab}
                  >
                    {isPublishingAny ? (
                      <>
                        {publishLoadingLabel}
                        <Loader2 className="ml-2 size-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        {publishActionLabel}
                        <Send className="ml-2 size-4" />
                      </>
                    )}
                  </Button>
                </span>
              </TooltipTrigger>
              {showDisclosureSelectionTooltip ? (
                <TooltipContent side="top">
                  <p>{COMMERCIAL_DISCLOSURE_REQUIRED_MESSAGE}</p>
                </TooltipContent>
              ) : null}
            </Tooltip>

            <p className="text-center text-xs text-muted-foreground">
              {activePublishTab === IntegrationProvider.TIKTOK
                ? TIKTOK_PROCESSING_NOTICE
                : "O modal permanece aberto enquanto o envio estiver em andamento."}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
