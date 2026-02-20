import { COMP_NAME, CompositionProps } from "@/components/remotion/constants";
import { api } from "@/utils/axios";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { NextResponse } from "next/server";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createRenderJob, updateRenderJob } from "./job-store";

const REMOTION_ENTRY_POINT = path.resolve(
  process.cwd(),
  "components/remotion/entry.ts",
);

const globalRemotionBundle = globalThis as typeof globalThis & {
  __QUIZZIO_REMOTION_BUNDLE__?: Promise<string>;
};

const REMOTION_TIMEOUT_MS = 300_000;

const normalizePercent = (value: number): number =>
  value <= 1 ? value * 100 : value;

const getRemotionBundleLocation = (onProgress?: (progress: number) => void) => {
  if (globalRemotionBundle.__QUIZZIO_REMOTION_BUNDLE__) {
    return globalRemotionBundle.__QUIZZIO_REMOTION_BUNDLE__;
  }

  const bundlePromise = bundle({
    entryPoint: REMOTION_ENTRY_POINT,
    onProgress: (progress) => {
      onProgress?.(progress);
    },
  }).catch((error) => {
    globalRemotionBundle.__QUIZZIO_REMOTION_BUNDLE__ = undefined;
    throw error;
  });

  globalRemotionBundle.__QUIZZIO_REMOTION_BUNDLE__ = bundlePromise;
  return bundlePromise;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CompositionProps.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Payload inválido para pré-render.",
          issues: parsed.error.issues,
        },
        { status: 400 },
      );
    }

    const job = createRenderJob();
    const cookieHeader = request.headers.get("cookie");

    void (async () => {
      const tempDirPath = await mkdtemp(path.join(tmpdir(), "quizzio-render-"));
      const outputPath = path.join(tempDirPath, "render.mp4");
      let progress = 1;

      try {
        updateRenderJob(job.id, {
          status: "rendering",
          progress,
          message: "Preparando bundle do Remotion...",
        });

        const serveUrl = await getRemotionBundleLocation((bundleProgress) => {
          const nextProgress = Math.min(
            18,
            Math.floor(normalizePercent(bundleProgress) * 0.18),
          );

          if (nextProgress > progress) {
            progress = nextProgress;
            updateRenderJob(job.id, {
              status: "rendering",
              progress,
              message: "Preparando bundle do Remotion...",
            });
          }
        });

        progress = Math.max(progress, 20);
        updateRenderJob(job.id, {
          status: "rendering",
          progress,
          message: "Carregando composição...",
        });

        const composition = await selectComposition({
          serveUrl,
          id: COMP_NAME,
          inputProps: parsed.data,
          timeoutInMilliseconds: REMOTION_TIMEOUT_MS,
          logLevel: "warn",
        });

        await renderMedia({
          serveUrl,
          composition,
          codec: "h264",
          outputLocation: outputPath,
          inputProps: parsed.data,
          concurrency: "75%",
          x264Preset: "veryfast",
          imageFormat: "jpeg",
          timeoutInMilliseconds: REMOTION_TIMEOUT_MS,
          hardwareAcceleration: 'if-possible',
          logLevel: "error",
          onProgress: (renderProgressData) => {
            const renderPercent = normalizePercent(renderProgressData.progress);
            const nextProgress = Math.min(
              88,
              Math.floor(20 + (renderPercent * 68) / 100),
            );

            if (nextProgress <= progress) {
              return;
            }

            progress = nextProgress;
            updateRenderJob(job.id, {
              status: "rendering",
              progress,
              message:
                renderProgressData.stitchStage === "encoding"
                  ? "Renderizando vídeo..."
                  : "Finalizando render...",
            });
          },
        });

        progress = Math.max(progress, 89);
        updateRenderJob(job.id, {
          status: "rendering",
          progress,
          message: "Renderização concluída.",
        });

        const videoBuffer = await readFile(outputPath);
        const formData = new FormData();

        formData.append(
          "file",
          new File([videoBuffer], "render.mp4", { type: "video/mp4" }),
        );
        formData.append("name", parsed.data.title);

        updateRenderJob(job.id, {
          status: "uploading",
          progress: 90,
          message: "Enviando vídeo para o bucket...",
        });

        const { data: uploadedVideo } = await api.post<{
          name?: string;
          url?: string;
        }>("/tiktok/videos/upload", formData, {
          headers: cookieHeader ? { cookie: cookieHeader } : undefined,
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
          timeout: 0,
        });

        updateRenderJob(job.id, {
          status: "done",
          progress: 100,
          message: "Vídeo pre-renderizado com sucesso.",
          video: {
            name: uploadedVideo.name,
            path: uploadedVideo.url,
            url: uploadedVideo.url,
          },
        });
      } catch (error) {
        updateRenderJob(job.id, {
          status: "error",
          progress,
          message:
            error instanceof Error
              ? error.message
              : "Falha ao pre-renderizar vídeo.",
        });
      } finally {
        await rm(tempDirPath, { recursive: true, force: true });
      }
    })();

    return NextResponse.json(
      {
        jobId: job.id,
      },
      { status: 202 },
    );
  } catch {
    return NextResponse.json(
      { message: "Falha ao iniciar pré-render." },
      { status: 500 },
    );
  }
}
