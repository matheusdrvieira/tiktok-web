import type { ReactNode } from "react";
import { AppShell } from "@/components/AppShell";

interface StudioLayoutProps {
  children: ReactNode;
}

export default function StudioLayout({ children }: StudioLayoutProps) {
  return <AppShell>{children}</AppShell>;
}
