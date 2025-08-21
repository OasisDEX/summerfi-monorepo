// Helper to extract an attribute value by name
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAttr = (u: any | undefined, key: string) => {
  const list = u?.Attributes ?? u?.UserAttributes

  return Array.isArray(list) ? list.find((a) => a.Name === key)?.Value : undefined
}

// Slugify helper for username base
export const slugifyName = (value: string) =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '')
    .slice(0, 50) || 'user'
