export function safeBTOA(str: string): string {
  return btoa(encodeURIComponent(str))
}

export function safeATOB(str: string): string {
  return decodeURIComponent(atob(str))
}
