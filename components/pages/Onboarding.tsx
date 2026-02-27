"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useIntegrationsService } from "@/services/integrationsService";
import { useTikTokService } from "@/services/tiktokService";
import { useYoutubeService } from "@/services/youtubeService";
import { IntegrationProvider } from "@/types/integrations";
import { Check, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type OnboardingPlatform = "tiktok" | "youtube";

const PLATFORMS: Array<{
  id: OnboardingPlatform;
  provider: IntegrationProvider;
  label: string;
  icon: string;
  colorClass: string;
}> = [
  {
    id: "tiktok",
    provider: IntegrationProvider.TIKTOK,
    label: "TikTok",
    icon: "🎵",
    colorClass: "bg-pink-500/10 border-pink-500/30 hover:border-pink-500/60",
  },
  {
    id: "youtube",
    provider: IntegrationProvider.YOUTUBE,
    label: "YouTube",
    icon: "▶️",
    colorClass: "bg-red-500/10 border-red-500/30 hover:border-red-500/60",
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [connecting, setConnecting] = useState<OnboardingPlatform | null>(null);
  const { getIntegrations } = useIntegrationsService();
  const { connectTikTok } = useTikTokService();
  const { connectYoutube } = useYoutubeService();

  const integrations = getIntegrations.data ?? [];
  const hasAnyConnected = integrations.some((integration) => integration.isActive);

  useEffect(() => {
    if (hasAnyConnected) {
      router.replace("/studio");
    }
  }, [hasAnyConnected, router]);

  const isConnected = (provider: IntegrationProvider): boolean => {
    return integrations.some(
      (integration) =>
        integration.provider === provider && integration.isActive === true,
    );
  };

  const handleConnect = async (platform: OnboardingPlatform) => {
    setConnecting(platform);

    try {
      if (platform === "tiktok") {
        await connectTikTok.mutateAsync();
        return;
      }

      await connectYoutube.mutateAsync();
    } finally {
      setConnecting(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(25_95%_53%/0.08),transparent_70%)]" />

      <div className="relative z-10 w-full max-w-lg space-y-8 text-center">
        <div className="space-y-2">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
            Q
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Bem-vindo ao Quizzio</h1>
          <p className="text-sm text-muted-foreground">
            Conecte pelo menos uma plataforma para começar a publicar seus vídeos.
          </p>
        </div>

        <div className="space-y-3">
          {PLATFORMS.map(({ id, provider, label, icon, colorClass }) => {
            const connected = isConnected(provider);
            const loading = connecting === id;

            return (
              <Card
                key={id}
                className={`card-blur border transition-colors ${colorClass} ${connected ? "border-emerald-500/50" : ""}`}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{icon}</span>
                    <div className="text-left">
                      <p className="text-sm font-medium">{label}</p>
                      {connected ? (
                        <Badge className="mt-0.5 border-emerald-500/30 bg-emerald-500/20 text-xs text-emerald-400">
                          Conectado
                        </Badge>
                      ) : null}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant={connected ? "ghost" : "default"}
                    disabled={connected || loading || getIntegrations.isLoading}
                    onClick={() => handleConnect(id)}
                  >
                    {loading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : connected ? (
                      <Check className="size-4 text-emerald-400" />
                    ) : (
                      "Conectar"
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="size-3 text-primary" />
          <span>Você pode adicionar mais plataformas depois em Integrações</span>
        </div>
      </div>
    </div>
  );
}
