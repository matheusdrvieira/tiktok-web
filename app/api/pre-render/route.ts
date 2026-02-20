import { COMP_NAME, CompositionProps } from "@/components/remotion/constants";
import { api } from "@/utils/axios";
import { execa } from "execa";
import { NextResponse } from "next/server";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createRenderJob, updateRenderJob } from "./job-store";

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
      let progress = 10;
      let smoothProgressTimer: ReturnType<typeof setInterval> | null = null;

      try {
        updateRenderJob(job.id, {
          status: "rendering",
          progress,
          message: "Iniciando renderização...",
        });

        const renderProcess = execa(
          "remotion",
          [
            "render",
            "components/remotion/entry.ts",
            COMP_NAME,
            outputPath,
            "--props",
            JSON.stringify(parsed.data),
            "--disallow-parallel-encoding",
          ],
          {
            cwd: process.cwd(),
            env: process.env,
            preferLocal: true,
            killSignal: "SIGKILL",
            forceKillAfterDelay: 2_000,
          },
        );

        smoothProgressTimer = setInterval(() => {
          if (progress >= 80) {
            return;
          }

          progress += 1;
          updateRenderJob(job.id, {
            status: "rendering",
            progress,
            message: "Renderizando vídeo...",
          });
        }, 700);

        await renderProcess;

        if (smoothProgressTimer) {
          clearInterval(smoothProgressTimer);
          smoothProgressTimer = null;
        }

        progress = Math.max(progress, 88);
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
        if (smoothProgressTimer) {
          clearInterval(smoothProgressTimer);
          smoothProgressTimer = null;
        }

        updateRenderJob(job.id, {
          status: "error",
          progress,
          message:
            error instanceof Error
              ? error.message
              : "Falha ao pre-renderizar vídeo.",
        });
      } finally {
        if (smoothProgressTimer) {
          clearInterval(smoothProgressTimer);
          smoothProgressTimer = null;
        }

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
