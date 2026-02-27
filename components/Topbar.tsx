"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";

const titles: Record<string, string> = {
  "/studio": "Estúdio",
  "/publish": "Estúdio",
  "/videos": "Vídeos",
  "/rendered-videos": "Vídeos",
  "/integrations": "Integrações",
};

export function Topbar() {
  const pathname = usePathname();
  const title = titles[pathname] || "Estúdio";

  return (
    <header className="flex h-14 items-center border-b border-border px-4 md:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
    </header>
  );
}
