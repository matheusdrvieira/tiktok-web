export type Platform = 'tiktok' | 'kwai' | 'youtube';

export interface AuthUser {
  provider: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface PlatformData {
  connected: boolean;
  username?: string;
  followerCount?: number;
  subscriberCount?: number;
  region?: string;
}

export type IntegrationsState = Record<Platform, PlatformData>;

export interface AppSettings {
  compactMode: boolean;
  channelName: string;
  outputDir: string;
}

export * from "./integrations";
export * from "./user";
