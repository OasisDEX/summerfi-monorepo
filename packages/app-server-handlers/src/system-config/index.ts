import { type AppConfigType, type EarnAppConfigType } from '@summerfi/app-types'

/**
 * Fetches the Earn App configuration from the remote endpoint.
 *
 * Uses the CONFIG_URL_EARN environment variable to determine the endpoint.
 * Returns a partial EarnAppConfigType object parsed from the JSON response.
 *
 * @returns {Promise<Partial<EarnAppConfigType>>} The fetched configuration object.
 * @throws {Error} If CONFIG_URL_EARN is not set or the fetch fails.
 */
export const configEarnAppFetcher = async function (): Promise<Partial<EarnAppConfigType>> {
  const configUrl = process.env.CONFIG_URL_EARN

  try {
    if (!configUrl) {
      throw new Error('CONFIG_URL_EARN is not set')
    }

    const response = await fetch(configUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return await response.json()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in configEarnAppFetcher', error, 'accessing:', configUrl)

    throw error
  }
}

/**
 * Fetches the Pro App configuration from the remote endpoint.
 *
 * Uses the CONFIG_URL environment variable to determine the endpoint.
 * Returns a partial AppConfigType object parsed from the JSON response.
 *
 * @returns {Promise<Partial<AppConfigType>>} The fetched configuration object.
 * @throws {Error} If CONFIG_URL is not set or the fetch fails.
 */
export const configProAppFetcher = async function (): Promise<Partial<AppConfigType>> {
  const configUrl = process.env.CONFIG_URL

  try {
    if (!configUrl) {
      throw new Error('CONFIG_URL is not set')
    }

    const response = await fetch(configUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    return await response.json()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in configProAppFetcher', error, 'accessing:', configUrl)

    throw error
  }
}
