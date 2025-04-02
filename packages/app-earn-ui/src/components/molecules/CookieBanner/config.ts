export const analyticsCookieName = 'analyticsCookie'

export enum AnalyticsCookieNames {
  MARKETING = 'marketing',
  ANALYTICS = 'analytics',
}

export const ANALYTICS_COOKIE_NAMES: readonly [
  AnalyticsCookieNames.ANALYTICS,
  AnalyticsCookieNames.MARKETING,
] = [AnalyticsCookieNames.ANALYTICS, AnalyticsCookieNames.MARKETING]

export type AnalyticsCookieName = (typeof ANALYTICS_COOKIE_NAMES)[number]

// this version should be aligned with version of cookies in pro.summer.fi/cookie
export const analyticsCookieVersion = 'version-27.08.2024'

export type SelectedAnalyticsCookies = { [key in AnalyticsCookieName]: boolean }

export type SavedAnalyticsCookiesSettings = {
  accepted: boolean
  enabledCookies: SelectedAnalyticsCookies
  version: string
}
