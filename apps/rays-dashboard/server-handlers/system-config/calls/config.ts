import { AppConfigType } from '@/types/generated'

export const configFetcher = async function (): Promise<Partial<AppConfigType>> {
  try {
    const response = await fetch(process.env.CONFIG_URL as string)
    const data = await response.json()

    return data as AppConfigType
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Error in configFetcher', error)

    throw error
  }
}
