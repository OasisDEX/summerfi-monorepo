import { REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { type AppConfigType, type EarnAppConfigType } from '@summerfi/app-types'

export const configFetcher = async function (): Promise<Partial<EarnAppConfigType>> {
  try {
    const response = await fetch(process.env.CONFIG_URL_EARN as string, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: REVALIDATION_TIMES.CONFIG },
    })
    const data = await response.json()

    return data as EarnAppConfigType
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Error in configFetcher', error, 'accessing:', process.env.CONFIG_URL_EARN)

    throw error
  }
}

export const mainConfigFetcher = async function (): Promise<Partial<AppConfigType>> {
  try {
    if (!process.env.CONFIG_URL) {
      throw new Error('CONFIG_URL is not set')
    }

    const response = await fetch(process.env.CONFIG_URL as string, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: REVALIDATION_TIMES.CONFIG },
    })

    const data = await response.json()

    return data as AppConfigType
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Error in configFetcher', error, 'accessing:', process.env.CONFIG_URL)

    throw error
  }
}
