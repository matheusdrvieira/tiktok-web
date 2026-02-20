"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuthService } from "@/services/authService";
import { Topbar } from "@/components/Topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const authService = useAuthService();
  const router = useRouter();
  const session = authService.getSession.data;
  const isPendingSession = authService.getSession.isPending;

  useEffect(() => {
    if (!isPendingSession && !session) {
      router.replace("/login");
    }
  }, [isPendingSession, router, session]);

  if (isPendingSession || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Carregando...</p>
      </main>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
