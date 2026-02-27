export const sanitizeHashtags = (value: string): string =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((tag) => (tag.startsWith("#") ? tag : `#${tag.replace(/^#+/, "")}`))
    .join(" ");
