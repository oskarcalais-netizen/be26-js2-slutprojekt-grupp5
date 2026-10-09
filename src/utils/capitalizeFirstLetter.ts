export function formatMemberName(name: string): string {
  if (!name || typeof name !== 'string') return '';
  const trimmed = name.trim();
  if (trimmed.length === 0) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function formatProjectTitle(title: string): string {
  if (!title || typeof title !== 'string') return '';
  const trimmed = title.trim();
  if (trimmed.length === 0) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function formatTaskTitle(title: string): string {
  if (!title || typeof title !== 'string') return '';
  const trimmed = title.trim();
  if (trimmed.length === 0) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}