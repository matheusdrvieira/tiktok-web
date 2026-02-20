"use client";

import type { Integration } from "@/types/integrations";
import { api } from "@/utils/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useIntegrationsService = () => {
  const router = useRouter();

  const connectTikTok = useMutation({
    mutationFn: async () => {
      router.push(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tiktok/auth/start`);
    },
  });

  const getIntegrations = useQuery({
    queryKey: ["integrations"],
    queryFn: async (): Promise<Integration[]> => {
      const { data } = await api.get<Integration[]>("/integrations");
      return data.length ? data : [];
    },
  });

  return {
    getIntegrations,
    connectTikTok,
  };
};
