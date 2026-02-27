export const formatDuration = (duration?: number): string => {
  if (typeof duration !== "number" || !Number.isFinite(duration)) {
    return "—";
  }

  const totalSeconds = Math.max(0, Math.round(duration));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

export const formatSize = (size?: number): string => {
  if (typeof size !== "number" || !Number.isFinite(size)) {
    return "—";
  }

  const units = ["B", "KB", "MB", "GB"];
  let value = Math.max(0, size);
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  const decimals = unitIndex === 0 ? 0 : 1;
  return `${value.toFixed(decimals)} ${units[unitIndex]}`;
};
