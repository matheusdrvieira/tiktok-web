"use client";

import { Player } from "@remotion/player";
import { useState } from "react";
import { AppShell } from "../../components/AppShell";
import { Button } from "../../components/Button";
import { authClient } from "../../lib/auth-client";
import { Main } from "../../remotion/MyComp/Main";
import {
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../../types/constants";

const fieldClassName =
  "leading-[1.7] block w-full rounded-geist bg-background p-geist-half text-foreground text-sm border border-unfocused-border-color transition-colors duration-150 ease-in-out focus:border-focused-border-color outline-none";

export default function DashboardPage() {
  const { data: session } = authClient.useSession();
  const [videoUrl, setVideoUrl] = useState("");

  return (
    <AppShell
      activeTab="dashboard"
      title="TikTok Quiz Dashboard"
      subtitle="Painel principal"
    >
      <div className="border border-unfocused-border-color rounded-geist bg-background p-geist">
        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)] items-start">
          <div className="overflow-hidden rounded-geist shadow-[0_0_120px_rgba(0,0,0,0.12)] w-full max-w-[300px] mx-auto xl:mx-0 xl:sticky xl:top-6">
            <Player
              component={Main}
              inputProps={defaultMyCompProps}
              durationInFrames={DURATION_IN_FRAMES}
              fps={VIDEO_FPS}
              compositionHeight={VIDEO_HEIGHT}
              compositionWidth={VIDEO_WIDTH}
              style={{ width: "100%" }}
              controls
              autoPlay
              loop
            />
          </div>

          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div>
              <label
                htmlFor="upload-user-id"
                className="block text-sm text-subtitle mb-geist-quarter"
              >
                User ID
              </label>
              <input
                id="upload-user-id"
                className={fieldClassName}
                value={session?.user?.id ?? ""}
                readOnly
              />
              <p className="text-xs text-subtitle mt-2">
                Campo exigido pela API de videos.
              </p>
            </div>

            <div>
              <label
                htmlFor="upload-video-url"
                className="block text-sm text-subtitle mb-geist-quarter"
              >
                URL do video
              </label>
              <input
                id="upload-video-url"
                className={fieldClassName}
                placeholder="https://exemplo.com/video.mp4"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.currentTarget.value)}
              />
              <p className="text-xs text-subtitle mt-2">
                Campo exigido pela API `POST /tiktok/videos`.
              </p>
            </div>

            <div className="pt-1">
              <Button disabled secondary>
                Publicar (em breve)
              </Button>
              <p className="text-xs text-subtitle mt-2">
                Sem envio ainda. Apenas campos suportados pela API atual.
              </p>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
