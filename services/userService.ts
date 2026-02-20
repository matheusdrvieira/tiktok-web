"use client";

import type {
  CreatorInfoResponse,
  GeneratedQuizVideoResponse,
  OutVideoOption,
  PreRenderJobApiResponse,
  PreRenderRequestPayload,
  PreRenderStartApiResponse,
  PublishVideoInput,
  PublishVideoResponse,
  TikTokCreatorInfoResponse,
  UserRenderedVideo
} from "@/types";
import { api, appApi } from "@/utils/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUserService = () => {
  const queryClient = useQueryClient();

  const getRenderedVideos = useQuery({
    queryKey: ["videos"],
    queryFn: async (): Promise<OutVideoOption[]> => {
      const { data } = await api.get<UserRenderedVideo[]>("/tiktok/videos/user");
      return data.map((video) => ({
        id: video.id,
        name: video.name,
        path: video.url,
        url: video.url,
        createdAt: video.createdAt,
      }));
    },
  });

  const generateQuizVideo = useMutation({
    mutationFn: async (): Promise<GeneratedQuizVideoResponse> => {
      const { data } = await api.post<GeneratedQuizVideoResponse>(
        "/ai/quiz/video",
        {},
        {
          timeout: 0,
        },
      );

      return data;
    },
  });

  const startPreRenderVideoJob = useMutation({
    mutationFn: async (
      payload: PreRenderRequestPayload,
    ): Promise<PreRenderStartApiResponse> => {
      const { data } = await appApi.post<PreRenderStartApiResponse>("/api/pre-render", payload);
      return data;
    },
  });

  const getPreRenderVideoJob = useMutation({
    mutationFn: async (jobId: string): Promise<PreRenderJobApiResponse> => {
      const { data } = await appApi.get<PreRenderJobApiResponse>(`/api/pre-render/jobs/${jobId}`);
      return data;
    },
    onSuccess: async (job) => {
      if (job.status !== "done") {
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["videos"],
      });
    },
  });

  const publishTikTokVideo = useMutation({
    mutationFn: async (
      payload: PublishVideoInput,
    ): Promise<PublishVideoResponse> => {
      const { data } = await api.post<PublishVideoResponse>(
        "/tiktok/post/direct",
        payload,
      );
      return data;
    },
  });

  const getRenderedVideo = useQuery({
    queryKey: ["videos"],
    queryFn: async (): Promise<UserRenderedVideo[]> => {
      const { data } = await api.get<UserRenderedVideo[]>("/tiktok/videos/user");
      return data;
    },
  });

  const getCreatorInfo = useQuery({
    queryKey: ["user-creator-info"],
    queryFn: async (): Promise<CreatorInfoResponse> => {
      const { data } = await api.get<TikTokCreatorInfoResponse>("/tiktok/post/creator-info");
      return data;
    }
  });

  return {
    getRenderedVideos,
    generateQuizVideo,
    startPreRenderVideoJob,
    getPreRenderVideoJob,
    publishTikTokVideo,
    getRenderedVideo,
    getCreatorInfo,
  };
};
