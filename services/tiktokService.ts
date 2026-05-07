"use client";

import type {
  PublishVideoInput,
  PublishVideoOutput,
  TikTokCreatorInfoOutput,
  TikTokPublishStatusOutput,
} from "@/types/tiktok";
import { api } from "@/utils/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const ACTIVE_PUBLISH_STATUSES = new Set([
  "PROCESSING_UPLOAD",
  "PROCESSING_DOWNLOAD",
]);

export const useTikTokService = (publishStatusId?: string | null) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const connectTikTok = useMutation({
    mutationFn: async () => {
      router.push(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tiktok/auth/start`);
    },
  });

  const getCreatorInfo = useQuery({
    queryKey: ["user-creator-info"],
    queryFn: async (): Promise<TikTokCreatorInfoOutput> => {
      const { data } = await api.get("/tiktok/post/creator-info");
      return data;
    },
    enabled: false,
  });

  const publishTikTok = useMutation({
    mutationFn: async (
      payload: PublishVideoInput,
    ): Promise<PublishVideoOutput> => {
      const { data } = await api.post("/tiktok/post/direct", payload);
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });

  const getPublishStatus = useQuery({
    queryKey: ["tiktok-publish-status", publishStatusId],
    queryFn: async (): Promise<TikTokPublishStatusOutput> => {
      const { data } = await api.get(`/tiktok/post/status/${publishStatusId}`);
      return data;
    },
    enabled: Boolean(publishStatusId),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && ACTIVE_PUBLISH_STATUSES.has(status) ? 5_000 : false;
    },
  });

  return {
    connectTikTok,
    getCreatorInfo,
    getPublishStatus,
    publishTikTok,
  };
};
