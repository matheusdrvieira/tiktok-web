export enum IntegrationProvider {
  TIKTOK = "TIKTOK",
  YOUTUBE = "YOUTUBE",
}

export type Platform = "tiktok" | "youtube";

export interface Integration {
  id: string;
  userId: string;
  provider: IntegrationProvider;
  isActive: boolean;
  credentials: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
