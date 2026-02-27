"use client";

import type {
  UploadYoutubeInput,
  UploadYoutubeOutput,
} from "@/types/youtube";
import { api } from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useYoutubeService = () => {
  const router = useRouter();

  const connectYoutube = useMutation({
    mutationFn: async () => {
      router.push(`${process.env.NEXT_PUBLIC_BACKEND_URL}/youtube/auth/start`);
    },
  });

  const uploadYoutube = useMutation({
    mutationFn: async (
      payload: UploadYoutubeInput,
    ): Promise<UploadYoutubeOutput> => {
      const { data } = await api.post(
        "/youtube/post/upload",
        payload,
        {
          timeout: 0,
        },
      );
      return data;
    },
  });

  return {
    connectYoutube,
    uploadYoutube,
  };
};
