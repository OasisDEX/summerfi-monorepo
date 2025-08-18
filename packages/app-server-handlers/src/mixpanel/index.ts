import { init, type Mixpanel } from 'mixpanel'

// Singleton instance
let mixpanelInstance: Mixpanel | null = null

/**
 * Gets or creates a singleton Mixpanel instance with the given key.
 *
 * @param key - The Mixpanel project token.
 * @returns A Mixpanel instance (singleton).
 */
export const getMixpanel = (key: string | undefined): Mixpanel => {
  if (!mixpanelInstance) {
    if (!key) {
      throw new Error('MIXPANEL_KEY is not defined')
    }
    mixpanelInstance = init(key)
  }

  return mixpanelInstance
}

/**
 * Tracks an event in Mixpanel with the given event name and body. To be used in server-side code.
 *
 * @param eventName - The name of the event to track.
 * @param eventBody - An object containing the properties of the event.
 *
 * Logs the event to the console if not in production or staging and MIXPANEL_LOG is enabled.
 * Otherwise, sends the event to Mixpanel. Catches and logs any errors during tracking.
 */
export const trackEventHandler = (
  eventName: string,
  eventBody: { [key: string]: unknown },
  mixpanel: Mixpanel,
): void => {
  const env = process.env.MIXPANEL_ENV
  const loggingEnabled = process.env.MIXPANEL_LOG

  if (env !== 'production' && env !== 'staging' && loggingEnabled) {
    // eslint-disable-next-line no-console
    console.info('\n✨ Mixpanel Event:', eventName, eventBody, '\n')

    return
  }
  try {
    mixpanel.track(`${eventName}`, eventBody)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error tracking event', error)
  }
}
