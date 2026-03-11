export function generateNextId(
  items: { id: string | number }[],
  prefix: string,
  startNumber: number,
): string {
  if (items.length === 0) return `${prefix}${startNumber}`;

  const numericIds = items.map((item) => {
    const idString = String(item.id);
    const numericPart = parseInt(idString.replace(prefix, ''), 10);
    return isNaN(numericPart) ? 0 : numericPart;
  });

  const maxId = Math.max(...numericIds);
  return `${prefix}${maxId + 1}`;
}
