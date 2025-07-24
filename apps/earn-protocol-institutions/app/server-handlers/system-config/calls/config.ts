import { REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { type AppConfigType, type EarnAppConfigType } from '@summerfi/app-types'

export const configFetcher = async function (): Promise<Partial<EarnAppConfigType>> {
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
      next: { revalidate: REVALIDATION_TIMES.CONFIG },
    })
    const data = await response.json()

    return data
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in configFetcher', error, 'accessing:', configUrl)

    throw error
  }
}

export const mainConfigFetcher = async function (): Promise<Partial<AppConfigType>> {
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
      next: { revalidate: REVALIDATION_TIMES.CONFIG },
    })

    const data = await response.json()

    return data
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in mainConfigFetcher', error, 'accessing:', configUrl)

    throw error
  }
}
