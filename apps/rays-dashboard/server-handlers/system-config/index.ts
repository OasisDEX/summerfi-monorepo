'use server'

import { ProtocolId } from '@summerfi/serverless-shared'

import { configFetcher } from '@/server-handlers/system-config/calls/config'
import { fetchContentfulGraphQL } from '@/server-handlers/system-config/calls/contentful'
import { navigationQuery } from '@/server-handlers/system-config/calls/navigation-query'
import { productHubFetcher } from '@/server-handlers/system-config/calls/product-hub'
import { parseNavigationResponse } from '@/server-handlers/system-config/parsers/parse-navigation-response'
import { lendingProtocolMap } from '@/types/lending-protocol'
import { NavigationResponse } from '@/types/navigation'

const systemConfigHandler = async () => {
  const config = await configFetcher()
  const protocols = [
    ...(config.features.AjnaSafetySwitch ? [] : [lendingProtocolMap[ProtocolId.AJNA]]),
    lendingProtocolMap[ProtocolId.AAVE_V2],
    lendingProtocolMap[ProtocolId.AAVE_V3],
    lendingProtocolMap[ProtocolId.MAKER],
    ...(config.features.MorphoSafetySwitch ? [] : [lendingProtocolMap[ProtocolId.MORPHO_BLUE]]),
    lendingProtocolMap[ProtocolId.SPARK],
  ]

  const [productHub, navigationResponse] = await Promise.all([
    productHubFetcher(protocols),
    fetchContentfulGraphQL<NavigationResponse>(navigationQuery),
  ])

  const navigation = parseNavigationResponse({ navigationResponse, productHub })

  return {
    config,
    navigation,
    productHub,
  }
}

export default systemConfigHandler