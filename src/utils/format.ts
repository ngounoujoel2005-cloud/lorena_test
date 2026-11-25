export function formatXAF(amount: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(amount)} XAF`;
}

export function formatOrderDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
