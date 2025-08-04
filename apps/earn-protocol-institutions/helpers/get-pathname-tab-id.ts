export const getMainTabBarTabId = (pathname: string): string => {
  const parts = pathname.split('/')

  return parts[2] ?? 'overview'
}

export const getPanelVaultNavigationTabId = (pathname: string): string => {
  const parts = pathname.split('/')

  return parts[4] ?? 'overview'
}
