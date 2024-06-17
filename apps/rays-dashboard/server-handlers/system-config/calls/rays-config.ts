import { AppRaysConfigType } from '@/types/generated/rays-types'

export const configRaysFetcher = async function (): Promise<AppRaysConfigType> {
  const response = await fetch(process.env.CONFIG_URL_RAYS as string)
  const data = await response.json()

  return data as AppRaysConfigType
}
