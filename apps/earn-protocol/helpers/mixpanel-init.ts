// mixpanel-browser is a ~50KB analytics dependency. It used to be imported and `.init()`-ed at
// module evaluation time (via a top-level side effect), which put it on the critical path of
// every route (it's pulled in app-wide by GlobalEventTracker). Instead, it's loaded lazily via
// dynamic `import()` the first time it's actually needed (warmed up from an idle callback after
// first paint, see GlobalEventTracker), and the resulting promise is cached so init only runs once.
import type { OverridedMixpanel } from 'mixpanel-browser'

type MixpanelInstance = OverridedMixpanel

let mixpanelPromise: Promise<MixpanelInstance> | null = null

const loadMixpanel = async (): Promise<MixpanelInstance> => {
  if (!process.env.NEXT_PUBLIC_EARN_MIXPANEL_KEY) {
    throw new Error('NEXT_PUBLIC_EARN_MIXPANEL_KEY is not defined')
  }

  const { default: mixpanelBrowser } = await import('mixpanel-browser')

  mixpanelBrowser.init(process.env.NEXT_PUBLIC_EARN_MIXPANEL_KEY, {
    debug: false,
    ip: false,
  })

  return mixpanelBrowser
}

/**
 * Resolves to the initialized mixpanel-browser instance, loading + initializing it on first call.
 * Safe to call from multiple places concurrently — later calls reuse the same in-flight/resolved
 * promise rather than re-importing/re-initializing.
 */
export const getMixpanelBrowser = (): Promise<MixpanelInstance> => {
  // Reset the cache on failure so a rejected promise isn't held forever (which would break
  // analytics for the rest of the session with no retry); a later call can then try again.
  mixpanelPromise ??= loadMixpanel().catch((error: unknown) => {
    mixpanelPromise = null

    throw error
  })

  return mixpanelPromise
}

/**
 * Kicks off the lazy load without callers needing to consume the promise. Intended to be called
 * once, off the critical render path (e.g. from a `requestIdleCallback` after first paint), so
 * mixpanel is already warm by the time real tracking calls arrive.
 */
export const initMixpanel = (): void => {
  // Warm-up only — swallow failures here (they're retried on the next real call); without a
  // catch, a failed load would surface as an unhandled rejection.
  void getMixpanelBrowser().catch(() => undefined)
}
