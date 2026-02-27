"use client";

import type {
  PublishVideoInput,
  PublishVideoOutput,
  TikTokCreatorInfoOutput
} from "@/types/tiktok";
import { api } from "@/utils/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useTikTokService = () => {
  const router = useRouter();

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
  });

  const publishTikTok = useMutation({
    mutationFn: async (
      payload: PublishVideoInput,
    ): Promise<PublishVideoOutput> => {
      const { data } = await api.post(
        "/tiktok/post/direct",
        payload,
      );
      return data;
    },
  });

  return {
    connectTikTok,
    getCreatorInfo,
    publishTikTok,
  };
};
