import { AppRaysConfigType } from '@/types/generated/rays-types'

export const configRaysFetcher = async function (): Promise<AppRaysConfigType> {
  try {
    const response = await fetch(process.env.CONFIG_URL_RAYS as string)
    const data = await response.json()

    return data as AppRaysConfigType
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Error in configRaysFetcher', error, 'accessing:', process.env.CONFIG_URL_RAYS)

    throw error
  }
}
