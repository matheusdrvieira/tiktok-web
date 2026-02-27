import { sanitizeHashtags } from "@/utils/sanitize-hashtags";

export const toHashtagsArray = (value: string): string[] =>
  sanitizeHashtags(value)
    .split(/\s+/)
    .filter((tag) => tag.length > 0);
