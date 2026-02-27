"use client";

import type { Integration } from "@/types/integrations";
import { api } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

export const useIntegrationsService = () => {
  const getIntegrations = useQuery({
    queryKey: ["integrations"],
    queryFn: async (): Promise<Integration[]> => {
      const { data } = await api.get("/integrations");
      return data.length ? data : [];
    },
  });

  return {
    getIntegrations,
  };
};
