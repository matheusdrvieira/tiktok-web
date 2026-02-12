"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AppShell } from "../../components/AppShell";
import { Button } from "../../components/Button";
import { authClient } from "../../lib/auth-client";

const providers = [
  {
    id: "tiktok",
    name: "TikTok",
    description: "Conecte sua conta TikTok via OAuth para publicar e gerenciar videos.",
    available: true,
  },
  {
    id: "youtube",
    name: "YouTube",
    description: "Integracao OAuth para publicar Shorts e acompanhar status.",
    available: false,
  },
  {
    id: "kwai",
    name: "Kwai",
    description: "Integracao OAuth para conectar conta e automatizar envios.",
    available: false,
  },
] as const;

type ProviderId = (typeof providers)[number]["id"];

const createInactiveMap = (): Record<ProviderId, boolean> => ({
  tiktok: false,
  youtube: false,
  kwai: false,
});

const readIntegrationField = (
  value: unknown,
  key: "provider" | "isActive",
): unknown => {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }

  const direct = (value as Record<string, unknown>)[key];
  if (direct !== undefined) {
    return direct;
  }

  const props = (value as Record<string, unknown>).props;
  if (typeof props !== "object" || props === null) {
    return undefined;
  }

  return (props as Record<string, unknown>)[key];
};

const toProviderId = (value: unknown): ProviderId | null => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.toLowerCase();
  if (normalized === "tiktok" || normalized === "youtube" || normalized === "kwai") {
    return normalized;
  }

  return null;
};

export default function IntegrationsPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3333";
  const [isLoadingIntegrations, setIsLoadingIntegrations] = useState(false);
  const [activeByProvider, setActiveByProvider] = useState<Record<ProviderId, boolean>>(
    createInactiveMap(),
  );

  useEffect(() => {
    if (!session?.user?.id) {
      setActiveByProvider(createInactiveMap());
      return;
    }

    let isCancelled = false;

    const loadIntegrations = async () => {
      setIsLoadingIntegrations(true);
      try {
        const { data } = await axios.get<unknown[]>(
          `${backendUrl}/tiktok/integrations/user/${session.user.id}`,
          { withCredentials: true },
        );

        if (isCancelled) {
          return;
        }

        const mapped = createInactiveMap();
        for (const integration of data) {
          const provider = toProviderId(readIntegrationField(integration, "provider"));
          if (!provider) {
            continue;
          }

          const isActive = Boolean(readIntegrationField(integration, "isActive"));
          mapped[provider] = isActive;
        }

        setActiveByProvider(mapped);
      } catch {
        if (!isCancelled) {
          setActiveByProvider(createInactiveMap());
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingIntegrations(false);
        }
      }
    };

    void loadIntegrations();

    return () => {
      isCancelled = true;
    };
  }, [backendUrl, session?.user?.id]);

  const onConnectTikTok = useCallback(() => {
    if (!session?.user?.id) {
      return;
    }

    const query = new URLSearchParams({
      userId: session.user.id,
    });
    router.push(`${backendUrl}/tiktok/auth/start?${query.toString()}`);
  }, [backendUrl, router, session?.user?.id]);

  return (
    <AppShell
      activeTab="integrations"
      title="TikTok Quiz Dashboard"
      subtitle="Integracoes OAuth"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {providers.map((provider) => (
          <article
            key={provider.id}
            className="border border-unfocused-border-color rounded-geist bg-background p-geist"
          >
            {(() => {
              const isConnected = activeByProvider[provider.id];

              return (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-semibold">{provider.name}</h2>
                    <span className="text-xs px-2 py-1 rounded-geist border border-unfocused-border-color text-subtitle">
                      {isConnected
                        ? "Conectado"
                        : provider.available
                          ? "Disponivel"
                          : "Em breve"}
                    </span>
                  </div>

                  <p className="text-sm text-subtitle min-h-[60px]">
                    {provider.description}
                  </p>

                  <div className="mt-5">
                    {provider.id === "tiktok" ? (
                      <Button
                        onClick={onConnectTikTok}
                        disabled={
                          !session?.user?.id || isLoadingIntegrations || isConnected
                        }
                      >
                        {isConnected
                          ? "Conectado"
                          : isLoadingIntegrations
                            ? "Verificando..."
                            : "Conectar com TikTok"}
                      </Button>
                    ) : (
                      <Button disabled secondary>
                        {isConnected ? "Conectado" : "Em breve"}
                      </Button>
                    )}
                  </div>
                </>
              );
            })()}
          </article>
        ))}
      </div>
    </AppShell>
  );
}
