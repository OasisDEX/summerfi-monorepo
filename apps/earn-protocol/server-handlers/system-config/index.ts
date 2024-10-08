import { lendingProtocolMap, type ProductHubData } from '@summerfi/app-types'
import { ProtocolId } from '@summerfi/serverless-shared'

import { configFetcher } from '@/server-handlers/system-config/calls/config'
import { productHubFetcher } from '@/server-handlers/system-config/calls/product-hub'
import { configRaysFetcher } from '@/server-handlers/system-config/calls/rays-config'

const systemConfigHandler = async () => {
  try {
    const config = await configFetcher()
    const protocols = [
      ...(config.features?.AjnaSafetySwitch ? [] : [lendingProtocolMap[ProtocolId.AJNA]]),
      lendingProtocolMap[ProtocolId.AAVE_V2],
      lendingProtocolMap[ProtocolId.AAVE_V3],
      lendingProtocolMap[ProtocolId.MAKER],
      ...(config.features?.MorphoSafetySwitch ? [] : [lendingProtocolMap[ProtocolId.MORPHO_BLUE]]),
      lendingProtocolMap[ProtocolId.SPARK],
    ]

    const [productHub, configRays] = await Promise.all([
      productHubFetcher(protocols),
      configRaysFetcher(),
    ])

    return {
      config,
      configRays,
      productHub: productHub as ProductHubData,
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
