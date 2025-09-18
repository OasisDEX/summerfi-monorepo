export const getMainTabBarTabId = (pathname: string): string => {
  const parts = pathname.split('/')

  return parts[2] ?? 'overview' // this might need to be updated if the routing change
}

export const getPanelVaultNavigationTabId = (pathname: string): string => {
  const parts = pathname.split('/')

  return parts[5] ?? 'overview' // this might need to be updated if the routing change
}

export const getPanelOverviewNavigationTabId = (pathname: string): string => {
  const parts = pathname.split('/')

  return parts[3] ?? 'institution' // this might need to be updated if the routing change
}
