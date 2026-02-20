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

      try {
        updateRenderJob(job.id, {
          status: "rendering",
          progress,
          message: "Iniciando renderização...",
        });

        const renderArgs = [
          "render",
          "components/remotion/entry.ts",
          COMP_NAME,
          outputPath,
          "--props",
          JSON.stringify(parsed.data),
          "--concurrency=2",
          "--log=verbose",
          "--disallow-parallel-encoding"
        ];

        const renderProcess = execa(
          "remotion",
          renderArgs,
          {
            cwd: process.cwd(),
            env: process.env,
            preferLocal: true,
            killSignal: "SIGKILL",
            forceKillAfterDelay: 2_000,
          },
        );

        const stripAnsi = (value: string): string =>
          value.replace(/\u001B\[[0-?]*[ -/]*[@-~]/g, "");

        const updateProgressFromLine = (line: string) => {
          const renderedMatch = line.match(/Rendered\s+(\d+)\/(\d+)/i);

          if (renderedMatch) {
            const current = Number(renderedMatch[1]);
            const total = Number(renderedMatch[2]);

            if (Number.isFinite(current) && Number.isFinite(total) && total > 0) {
              const nextProgress = Math.min(85, Math.floor(10 + (current / total) * 75));
              if (nextProgress > progress) {
                progress = nextProgress;
                updateRenderJob(job.id, {
                  status: "rendering",
                  progress,
                  message: `Renderizando vídeo (${current}/${total})...`,
                });
              }
            }

            return;
          }

          const encodedMatch = line.match(/Encoded\s+(\d+)\/(\d+)/i);

          if (encodedMatch) {
            const current = Number(encodedMatch[1]);
            const total = Number(encodedMatch[2]);

            if (Number.isFinite(current) && Number.isFinite(total) && total > 0) {
              const nextProgress = Math.min(95, Math.floor(85 + (current / total) * 10));
              if (nextProgress > progress) {
                progress = nextProgress;
                updateRenderJob(job.id, {
                  status: "rendering",
                  progress,
                  message: `Finalizando render (${current}/${total})...`,
                });
              }
            }
          }
        };

        const parseChunk = (chunk: string | Buffer) => {
          const lines = chunk
            .toString()
            .split(/\r?\n|\r/g)
            .map((line) => stripAnsi(line).trim())
            .filter((line) => line.length > 0);

          for (const line of lines) {
            console.log(`[pre-render][remotion] ${line}`);
            updateProgressFromLine(line);
          }
        };

        renderProcess.stdout?.on("data", parseChunk);
        renderProcess.stderr?.on("data", parseChunk);

        await renderProcess;

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
