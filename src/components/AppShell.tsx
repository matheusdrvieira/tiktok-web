"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { authClient } from "../lib/auth-client";
import { cn } from "../lib/utils";
import { Button } from "./Button";

type TabId = "dashboard" | "integrations";

const tabs: Array<{
  id: TabId;
  label: string;
  href: string;
}> = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard" },
  { id: "integrations", label: "Integrations", href: "/integrations" },
];

export const AppShell: React.FC<{
  activeTab: TabId;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}> = ({ activeTab, title, subtitle, children }) => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, router, session]);

  const onSignOut = useCallback(async () => {
    await authClient.signOut();
    router.replace("/login");
  }, [router]);

  if (isPending || !session) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p className="text-subtitle">Carregando...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-unfocused-border-color">
        <div className="max-w-screen-2xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold">{title}</h1>
            <p className="text-subtitle text-sm">{subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-subtitle text-sm hidden sm:block">
              {session.user.email}
            </span>
            <Button secondary onClick={onSignOut}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-2xl mx-auto px-4 py-6 md:flex md:gap-6">
        <aside className="md:w-64 shrink-0">
          <div className="border border-unfocused-border-color rounded-geist bg-background p-3 md:p-4 mb-4 md:mb-0">
            <p className="text-xs uppercase tracking-wide text-subtitle mb-3">
              Navegacao
            </p>
            <nav className="flex md:flex-col gap-2">
              {tabs.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    className={cn(
                      "h-10 px-3 rounded-geist border text-sm font-medium text-left",
                      isActive
                        ? "border-focused-border-color bg-foreground text-background"
                        : "border-unfocused-border-color bg-background text-foreground hover:border-focused-border-color",
                    )}
                    onClick={() => router.push(tab.href)}
                    type="button"
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <section className="flex-1">{children}</section>
      </div>
    </main>
  );
};
