export const getAppV2StaticFileUrl = (path: string) => {
  if (path.startsWith('/')) {
    return `/app-v2${path}`
  }

  return `/app-v2/${path}`
}
