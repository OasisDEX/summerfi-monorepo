import { configFetcher } from '@/server-handlers/system-config/calls/config'

const systemConfigHandler = async () => {
  try {
    const config = await configFetcher()

    return {
      config,
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('Error in systemConfigHandler', error)

    throw error
  }
}

export default systemConfigHandler

export type SystemConfig = Awaited<ReturnType<typeof systemConfigHandler>>
