import { randomUUID } from "node:crypto";

export type RenderJobStatus =
  | "queued"
  | "rendering"
  | "uploading"
  | "done"
  | "error";

export type RenderJobVideo = {
  name?: string;
  path?: string;
  url?: string;
};

export type RenderJob = {
  id: string;
  status: RenderJobStatus;
  progress: number;
  message?: string;
  video?: RenderJobVideo;
  createdAt: string;
  updatedAt: string;
};

const JOB_TTL_MS = 30 * 60 * 1000;
const STORE_KEY = "__QUIZZIO_PRE_RENDER_JOBS__";

const globalStore = globalThis as typeof globalThis & {
  [STORE_KEY]?: Map<string, RenderJob>;
};

const getStore = (): Map<string, RenderJob> => {
  if (!globalStore[STORE_KEY]) {
    globalStore[STORE_KEY] = new Map<string, RenderJob>();
  }

  return globalStore[STORE_KEY];
};

const nowIso = (): string => new Date().toISOString();

const clampProgress = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(value)));
};

const pruneExpiredJobs = (): void => {
  const store = getStore();
  const now = Date.now();

  for (const [id, job] of store.entries()) {
    const updatedAt = new Date(job.updatedAt).getTime();

    if (!Number.isFinite(updatedAt) || now - updatedAt > JOB_TTL_MS) {
      store.delete(id);
    }
  }
};

export const createRenderJob = (): RenderJob => {
  pruneExpiredJobs();

  const timestamp = nowIso();
  const job: RenderJob = {
    id: randomUUID(),
    status: "queued",
    progress: 0,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  getStore().set(job.id, job);
  return job;
};

export const getRenderJob = (jobId: string): RenderJob | null => {
  pruneExpiredJobs();
  return getStore().get(jobId) ?? null;
};

export const updateRenderJob = (
  jobId: string,
  input: Partial<Pick<RenderJob, "status" | "progress" | "message" | "video">>,
): RenderJob | null => {
  const store = getStore();
  const current = store.get(jobId);

  if (!current) {
    return null;
  }

  const next: RenderJob = {
    ...current,
    ...input,
    progress:
      typeof input.progress === "number"
        ? clampProgress(input.progress)
        : current.progress,
    updatedAt: nowIso(),
  };

  store.set(jobId, next);
  return next;
};
