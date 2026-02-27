"use client";

import type {
  RenderVideoInput,
  RenderVideoOutput,
  UpdateVideoInput,
  UpdateVideoOutput,
  VideoOutput,
} from "@/types/videos";
import { api } from "@/utils/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useVideosService = () => {
  const queryClient = useQueryClient();

  const listVideos = useQuery({
    queryKey: ["videos"],
    queryFn: async (): Promise<VideoOutput[]> => {
      const { data } = await api.get("/videos");
      return data;
    },
  });

  const renderVideo = useMutation({
    mutationFn: async (
      payload: RenderVideoInput,
    ): Promise<RenderVideoOutput> => {
      const { data } = await api.post("/remotion/render", payload, {
        timeout: 0,
      });
      return data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["videos"],
      });
    },
  });

  const updateVideo = useMutation({
    mutationFn: async (
      payload: UpdateVideoInput,
    ): Promise<UpdateVideoOutput> => {
      const { videoId, ...body } = payload;
      const { data } = await api.put(
        `/videos/${videoId}`,
        body,
      );
      return data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["videos"] }),
        queryClient.invalidateQueries({ queryKey: ["quizzes"] }),
        queryClient.invalidateQueries({ queryKey: ["quizzes", "latest"] }),
      ]);
    },
  });

  return {
    listVideos,
    renderVideo,
    updateVideo,
  };
};
