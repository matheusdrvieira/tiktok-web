"use client";

import type {
  RenderJobStatusOutput,
  RenderVideoInput,
  RenderVideoOutput,
  UpdateVideoInput,
  UpdateVideoOutput,
  VideoOutput,
} from "@/types/videos";
import { api } from "@/utils/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const ACTIVE_RENDER_JOB_STATUSES = ["QUEUED", "RUNNING"];

export const useVideosService = (renderJobId?: string | null) => {
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
        timeout: 30_000,
      });
      return data;
    },
  });

  const renderVideoJob = useQuery({
    queryKey: ["render-video-job", renderJobId],
    enabled: Boolean(renderJobId),
    queryFn: async (): Promise<RenderJobStatusOutput> => {
      const { data } = await api.get(`/remotion/render/${renderJobId}`);
      return data;
    },
    refetchInterval: (query) => {
      const status = query.state.data?.job.status;
      return status && ACTIVE_RENDER_JOB_STATUSES.includes(status) ? 3_000 : false;
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
    renderVideoJob,
    updateVideo,
  };
};
