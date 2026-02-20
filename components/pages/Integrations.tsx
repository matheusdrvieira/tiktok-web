"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useIntegrationsService } from "@/services/integrationsService";
import type { IntegrationProvider, Platform } from "@/types";
import { Link2, RefreshCw } from "lucide-react";

const platforms: { id: Platform; name: string; icon: string; description: string }[] = [
  {
    id: "tiktok",
    name: "TikTok",
    icon: "♪",
    description: "Conecte sua conta para publicar vídeos e consultar status.",
  },
  {
    id: "kwai",
    name: "Kwai",
    icon: "◆",
    description: "Conecte sua conta para publicar vídeos e consultar status.",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "▶",
    description: "Conecte sua conta para publicar vídeos e consultar status.",
  },
];

const providerByPlatform: Record<Platform, IntegrationProvider> = {
  tiktok: "TIKTOK",
  kwai: "KWAI",
  youtube: "YOUTUBE",
};

export default function Integrations() {
  const { getIntegrations, connectTikTok } = useIntegrationsService();
  const { toast } = useToast();
  const integrations = getIntegrations.data ?? [];
  const isLoadingIntegrations = getIntegrations.isLoading;
  const isConnectingTikTok = connectTikTok.isPending;

  const isConnected = (platform: Platform): boolean => {
    return integrations.some(
      (integration) =>
        integration.provider === providerByPlatform[platform] &&
        integration.isActive === true,
    );
  };

  const handleConnect = async (platform: Platform) => {
    if (platform !== "tiktok") {
      toast({
        title: "Em breve",
        description: `${platform} ainda não possui fluxo de conexão.`,
      });
      return;
    }

    try {
      await connectTikTok.mutateAsync();
    } catch {
      toast({
        title: "Erro ao iniciar conexão",
        description: "Não foi possível iniciar o fluxo OAuth.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => {
          const connected = isConnected(platform.id);

          return (
            <Card key={platform.id} className="card-blur">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <span className="text-xl leading-none">{platform.icon}</span>
                  </div>
                  <div>
                    <CardTitle className="text-base">{platform.name}</CardTitle>
                    <CardDescription className="text-xs">{platform.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Badge variant={connected ? 'default' : 'secondary'} className={connected ? 'bg-primary/20 text-primary border-primary/30' : ''}>
                  {connected ? "Conectado" : "Não conectado"}
                </Badge>

                <div className={connected ? "flex items-center gap-2" : "flex gap-2"}>
                  {!connected ? (
                    <Button
                      size="sm"
                      onClick={() => handleConnect(platform.id)}
                      disabled={isLoadingIntegrations || (platform.id === "tiktok" && isConnectingTikTok)}
                    >
                      <Link2 className="mr-2 size-4" />
                      {isLoadingIntegrations
                        ? "Verificando..."
                        : platform.id === "tiktok" && isConnectingTikTok
                          ? "Conectando..."
                          : "Conectar via OAuth"}
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleConnect(platform.id)}
                      disabled={isLoadingIntegrations || (platform.id === "tiktok" && isConnectingTikTok)}
                    >
                      <RefreshCw className="mr-2 size-4" />
                      Reautenticar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
