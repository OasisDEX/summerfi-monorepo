import { configFetcher } from '@/server-handlers/system-config/calls/config'
import { configRaysFetcher } from '@/server-handlers/system-config/calls/rays-config'

const systemConfigHandler = async () => {
  try {
    const [config, configRays] = await Promise.all([configFetcher(), configRaysFetcher()])

    return {
      config,
      configRays,
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
