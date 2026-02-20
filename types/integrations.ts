export type IntegrationProvider = "TIKTOK" | "KWAI" | "YOUTUBE";

export interface Integration {
  id: string;
  userId: string;
  provider: IntegrationProvider;
  isActive: boolean;
  credentials: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
