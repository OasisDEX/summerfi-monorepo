import { type EarnAppConfigType } from '@summerfi/app-types'

export const configFetcher = async function (): Promise<Partial<EarnAppConfigType>> {
  try {
    const response = await fetch(process.env.CONFIG_URL_EARN as string, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { tags: ['config'], revalidate: 60 },
    })
    const data = await response.json()

    return data as EarnAppConfigType
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Error in configFetcher', error, 'accessing: ', process.env.CONFIG_URL_EARN)

    throw error
  }
}
