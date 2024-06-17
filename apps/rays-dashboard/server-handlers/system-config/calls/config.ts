import { AppConfigType } from '@/types/generated'

export const configFetcher = async function (): Promise<AppConfigType> {
  const response = await fetch(process.env.CONFIG_URL as string)
  const data = await response.json()

  return data as AppConfigType
}
