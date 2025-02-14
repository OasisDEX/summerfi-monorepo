export function safeBTOA(str: string) {
  return btoa(encodeURIComponent(str))
}

export function safeATOB(str: string) {
  return decodeURIComponent(atob(str))
}
