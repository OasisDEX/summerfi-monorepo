// Helper to extract an attribute value by name
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAttr = (u: any | undefined, key: string) => {
  const list = u?.Attributes ?? u?.UserAttributes

  return Array.isArray(list) ? list.find((a) => a.Name === key)?.Value : undefined
}
