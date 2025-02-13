export const isOutsideLink = (href: string): boolean => {
  return href.startsWith('http')
}
