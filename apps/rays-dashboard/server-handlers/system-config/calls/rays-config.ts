import { type AppRaysConfigType } from '@summerfi/app-types'

export const configRaysFetcher = async function (): Promise<AppRaysConfigType> {
  try {
    const response = await fetch(process.env.CONFIG_URL_RAYS as string, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { tags: ['configRays'], revalidate: 60 },
    })
    const data = await response.json()

    return data as AppRaysConfigType
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Error in configRaysFetcher', error, 'accessing:', process.env.CONFIG_URL_RAYS)

    throw error
  }
}
