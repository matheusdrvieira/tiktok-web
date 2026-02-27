export const formatRenderedAt = (createdAt?: string): string => {
  if (!createdAt) {
    return "—";
  }

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
