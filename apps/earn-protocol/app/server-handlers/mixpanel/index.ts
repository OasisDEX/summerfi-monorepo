import { init } from 'mixpanel'

if (!process.env.EARN_MIXPANEL_KEY) {
  throw new Error('EARN_MIXPANEL_KEY is not defined')
}

const mixpanel = init(process.env.EARN_MIXPANEL_KEY)

export const trackEventHandler = (eventName: string, eventBody: { [key: string]: unknown }) => {
  const env = process.env.MIXPANEL_ENV
  const loggingEnabled = process.env.MIXPANEL_LOG

  if (env !== 'production' && env !== 'staging' && loggingEnabled) {
    // eslint-disable-next-line no-console
    console.info('\n✨ Mixpanel Event:', eventName, eventBody, '\n')

    return null
  }
  try {
    mixpanel.track(`${eventName}`, eventBody)

    return null
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error tracking event', error)

    return null
  }
}
